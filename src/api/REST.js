import fetch from 'node-fetch';
import { ChannelEndpoints } from './endpoints/Channels.js';
import { UserEndpoints } from './endpoints/Users.js';
import { VoiceEndpoints } from './endpoints/Voice.js';
import { WebhookEndpoints } from './endpoints/Webhooks.js';
import { InteractionEndpoints } from './endpoints/Interactions.js';
import { EmojiEndpoints } from './endpoints/Emojis.js';
import { StickerEndpoints } from './endpoints/Stickers.js';
import { ThreadEndpoints } from './endpoints/Threads.js';
import { GuildEndpoints } from './endpoints/Guilds.js';
import { AuditLogEndpoints } from './endpoints/AuditLogs.js';
import { InviteEndpoints } from './endpoints/Invites.js';
import { ApplicationCommandEndpoints } from './endpoints/ApplicationCommands.js';
import { StageChannelEndpoints } from './endpoints/StageChannels.js';
import { OnboardingEndpoints } from './endpoints/Onboarding.js';
import { SoundboardEndpoints } from './endpoints/Soundboard.js';
import { PollEndpoints } from './endpoints/Polls.js';
import { AutoModerationEndpoints } from './endpoints/AutoModeration.js';
import { AccountEndpoints } from './endpoints/Account.js';
import { RelationshipEndpoints } from './endpoints/Relationships.js';
import { ApplicationEndpoints } from './endpoints/Application.js';
import { BillingEndpoints } from './endpoints/Billing.js';
import { APIError, RateLimitError, ConnectionError } from '../utils/Errors.js';

export class REST {
  constructor(client) {
    this.client = client;
    this.baseURL = 'https://discord.com/api/v10';
    this.maxRetries = 3;
    this.retryDelay = 1000;
    this.applicationId = null;
    
    this.account = new AccountEndpoints(this);
    this.relationships = new RelationshipEndpoints(this);
    this.guilds = new GuildEndpoints(this);
    this.auditLogs = new AuditLogEndpoints(this);
    this.invites = new InviteEndpoints(this);
    this.applicationCommands = new ApplicationCommandEndpoints(this);
    this.stageChannels = new StageChannelEndpoints(this);
    this.onboarding = new OnboardingEndpoints(this);
    this.soundboard = new SoundboardEndpoints(this);
    this.polls = new PollEndpoints(this);
    this.autoModeration = new AutoModerationEndpoints(this);
    this.applications = new ApplicationEndpoints(this);
    this.billing = new BillingEndpoints(this);
    this.channels = new ChannelEndpoints(this);
    this.users = new UserEndpoints(this);
    this.voice = new VoiceEndpoints(this);
    this.webhooks = new WebhookEndpoints(this);
    this.interactions = new InteractionEndpoints(this);
    this.emojis = new EmojiEndpoints(this);
    this.stickers = new StickerEndpoints(this);
    this.threads = new ThreadEndpoints(this);
  }

  async request(method, endpoint, options = {}, retryCount = 0) {
    const url = `${this.baseURL}${endpoint}`;
    
    this.client.logger.debug(`Making ${method} request to ${endpoint}`);
    
    await this.client.rateLimiter.waitBeforeRequest(endpoint, method);
    
    const riskAssessment = this.client.safetyManager.assessRisk(
      `${method}:${endpoint}`,
      options
    );
    
    if (!riskAssessment.allowed) {
      this.client.logger.warn(`Request blocked by safety manager`, {
        endpoint,
        method,
        risk: riskAssessment.risk
      });
      throw new APIError('Action blocked by safety manager', riskAssessment.risk, method, endpoint);
    }
    
    this.client.safetyManager.logAction(`${method}:${endpoint}`, options);
    
    const headers = {
      'Authorization': this.client.tokenManager.getToken(),
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      ...options.headers
    };
    
    const fetchOptions = {
      method,
      headers,
      ...options
    };
    
    if (options.body) {
      if (typeof options.body === 'object' && !(options.body instanceof Buffer) && !(options.body instanceof FormData)) {
        fetchOptions.body = JSON.stringify(options.body);
      } else {
        fetchOptions.body = options.body;
      }
    }
    
    try {
      const response = await fetch(url, fetchOptions);
      
      const rateLimitHeaders = this._parseRateLimitHeaders(response.headers);
      this._updateRateLimits(rateLimitHeaders);
      
      if (!response.ok) {
        await this._handleErrorResponse(response, method, endpoint, options, retryCount);
      }
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        this.client.logger.debug(`Request successful`, { endpoint, method });
        return data;
      }
      
      const data = await response.text();
      this.client.logger.debug(`Request successful`, { endpoint, method });
      return data;
    } catch (error) {
      if (error instanceof APIError || error instanceof RateLimitError) {
        throw error;
      }
      
      if (retryCount < this.maxRetries && this._isRetryableError(error)) {
        this.client.logger.warn(`Retrying request due to error: ${error.message}`, {
          endpoint,
          method,
          retryCount: retryCount + 1
        });
        await this._sleep(this.retryDelay * Math.pow(2, retryCount));
        return this.request(method, endpoint, options, retryCount + 1);
      }
      
      this.client.logger.error(`Request failed after ${retryCount} retries`, {
        endpoint,
        method,
        error: error.message
      });
      throw new ConnectionError(`Request failed: ${error.message}`);
    }
  }

  async _handleErrorResponse(response, method, endpoint, options, retryCount) {
    const status = response.status;
    
    if (status === 429) {
      const retryAfterHeader = response.headers.get('Retry-After');
      let retryAfter = parseInt(retryAfterHeader || '5');
      if (isNaN(retryAfter) || retryAfter < 0) {
        retryAfter = 5;
      }
      const isGlobal = response.headers.get('X-RateLimit-Global') === 'true';
      
      this.client.logger.warn(`Rate limited. ${isGlobal ? 'Global' : 'Local'} rate limit. Retrying after ${retryAfter}s`);
      
      if (isGlobal) {
        this.client.rateLimiter.globalLimitActive = true;
      }
      
      await this._sleep(retryAfter * 1000);
      return this.request(method, endpoint, options, retryCount);
    }
    
    if (status === 400) {
      const error = await response.text();
      this.client.logger.error(`Bad Request: ${error}`, { endpoint, method });
      throw new APIError(`Bad Request: ${error}`, status, method, endpoint);
    }
    
    if (status === 401) {
      const error = await response.text();
      this.client.logger.error(`Unauthorized: Invalid token`, { endpoint, method });
      throw new APIError(`Unauthorized: Invalid or expired token`, status, method, endpoint);
    }
    
    if (status === 403) {
      const error = await response.text();
      this.client.logger.error(`Forbidden: ${error}`, { endpoint, method });
      throw new APIError(`Forbidden: ${error}`, status, method, endpoint);
    }
    
    if (status === 404) {
      this.client.logger.error(`Not Found: Resource does not exist`, { endpoint, method });
      throw new APIError(`Not Found: Resource does not exist`, status, method, endpoint);
    }
    
    if (status === 502 || status === 503 || status === 504) {
      if (retryCount < this.maxRetries) {
        this.client.logger.warn(`Server error ${status}. Retrying...`, {
          endpoint,
          method,
          retryCount: retryCount + 1
        });
        await this._sleep(this.retryDelay * Math.pow(2, retryCount));
        return this.request(method, endpoint, options, retryCount + 1);
      }
    }
    
    if (status === 500) {
      const error = await response.text();
      this.client.logger.error(`Internal Server Error: ${error}`, { endpoint, method });
      throw new APIError(`Internal Server Error: ${error}`, status, method, endpoint);
    }
    
    const error = await response.text();
    this.client.logger.error(`HTTP ${status} error`, {
      endpoint,
      method,
      error: error.substring(0, 200)
    });
    throw new APIError(`HTTP ${status}: ${error}`, status, method, endpoint);
  }

  _isRetryableError(error) {
    const retryableErrors = ['ECONNRESET', 'ETIMEDOUT', 'ECONNREFUSED', 'ENOTFOUND'];
    return retryableErrors.some(err => error.message.includes(err)) ||
           error.message.includes('network') ||
           error.message.includes('timeout');
  }

  async get(endpoint, options = {}) {
    return this.request('GET', endpoint, options);
  }

  async post(endpoint, options = {}) {
    return this.request('POST', endpoint, options);
  }

  async put(endpoint, options = {}) {
    return this.request('PUT', endpoint, options);
  }

  async patch(endpoint, options = {}) {
    return this.request('PATCH', endpoint, options);
  }

  async delete(endpoint, options = {}) {
    return this.request('DELETE', endpoint, options);
  }

  _parseRateLimitHeaders(headers) {
    return {
      limit: headers.get('X-RateLimit-Limit'),
      remaining: headers.get('X-RateLimit-Remaining'),
      reset: headers.get('X-RateLimit-Reset'),
      bucket: headers.get('X-RateLimit-Bucket'),
      global: headers.get('X-RateLimit-Global')
    };
  }

  _updateRateLimits(headers) {
    if (headers.remaining != null) {
      const remaining = parseInt(headers.remaining);
      if (!isNaN(remaining)) {
        this.client.rateLimiter.remaining = remaining;
      }
    }
    
    if (headers.reset != null) {
      const reset = parseInt(headers.reset);
      if (!isNaN(reset)) {
        this.client.rateLimiter.resetTime = reset * 1000;
      }
    }
    
    if (headers.global === 'true') {
      this.client.rateLimiter.globalLimitActive = true;
    } else if (headers.global === 'false') {
      this.client.rateLimiter.globalLimitActive = false;
    }
  }

  _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
