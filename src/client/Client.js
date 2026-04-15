import { TokenManager } from '../security/TokenManager.js';
import { RateLimiter } from '../utils/RateLimiter.js';
import { SafetyManager } from '../security/SafetyManager.js';
import { Logger } from '../utils/Logger.js';
import { REST } from '../api/REST.js';
import { Gateway } from '../api/Gateway.js';
import { TokenError, ConnectionError } from '../utils/Errors.js';

export class Client {
  constructor(options = {}) {
    this.options = {
      safety: options.safety || 'strict',
      rateLimitMode: options.rateLimitMode || 'conservative',
      autoCooldown: options.autoCooldown !== false,
      humanEmulation: options.humanEmulation !== false,
      auditLogging: options.auditLogging !== false,
      riskWarnings: options.riskWarnings !== false,
      emergencyStop: options.emergencyStop !== false,
      logLevel: options.logLevel || 'info',
      ...options
    };

    if (!options.token && !process.env.DISCORD_TOKEN) {
      throw new TokenError('Token is required. Set it via options.token or DISCORD_TOKEN environment variable');
    }

    this.logger = new Logger({ level: this.options.logLevel });

    try {
      this.tokenManager = new TokenManager(options.token);
      this.rateLimiter = new RateLimiter(this.options);
      this.safetyManager = new SafetyManager(this.options);
      
      this.rest = new REST(this);
      this.gateway = new Gateway(this);
      
      this.connected = false;
      this.ready = false;
      
      this.logger.info('D.O.U.B.L.E client initialized');
    } catch (error) {
      this.logger.error('Failed to initialize client', { error: error.message });
      throw error;
    }
  }

  async connect() {
    if (this.connected) {
      this.logger.warn('Client is already connected');
      throw new ConnectionError('Client is already connected');
    }

    try {
      const token = this.tokenManager.getToken();
      if (!token) {
        this.logger.error('Token is required');
        throw new TokenError('Token is required. Set it via options.token or DISCORD_TOKEN environment variable');
      }

      this.logger.info('Validating token');
      await this.tokenManager.validateToken(token);

      this.logger.info('Connecting to gateway');
      await this.gateway.connect(token);
      this.connected = true;
      this.ready = true;
      
      const profile = await this.rest.get('/users/@me');
      this.rest.applicationId = profile.id;
      
      this.logger.info('Connected successfully');
    } catch (error) {
      this.connected = false;
      this.logger.error('Connection failed', { error: error.message });
      throw error;
    }
  }

  async disconnect() {
    try {
      if (!this.connected) {
        this.logger.warn('Client is not connected');
        return;
      }

      this.logger.info('Disconnecting from gateway');
      await this.gateway.disconnect();
      this.connected = false;
      this.ready = false;
      
      this.rateLimiter.reset();
      this.rateLimiter.destroy();
      this.safetyManager.reset();
      this.safetyManager.destroy();
      
      this.logger.info('Disconnected successfully');
    } catch (error) {
      this.logger.error('Error during disconnect', { error: error.message });
      this.connected = false;
      this.ready = false;
    }
  }

  get account() {
    return this.rest.account;
  }

  get relationships() {
    return this.rest.relationships;
  }

  get guilds() {
    return this.rest.guilds;
  }

  get applications() {
    return this.rest.applications;
  }

  get billing() {
    return this.rest.billing;
  }

  get channels() {
    return this.rest.channels;
  }

  get users() {
    return this.rest.users;
  }

  get voice() {
    return this.rest.voice;
  }

  get webhooks() {
    return this.rest.webhooks;
  }

  get interactions() {
    return this.rest.interactions;
  }

  get emojis() {
    return this.rest.emojis;
  }

  get stickers() {
    return this.rest.stickers;
  }

  get threads() {
    return this.rest.threads;
  }

  get auditLogs() {
    return this.rest.auditLogs;
  }

  get invites() {
    return this.rest.invites;
  }

  get applicationCommands() {
    return this.rest.applicationCommands;
  }

  get stageChannels() {
    return this.rest.stageChannels;
  }

  get onboarding() {
    return this.rest.onboarding;
  }

  get soundboard() {
    return this.rest.soundboard;
  }

  get polls() {
    return this.rest.polls;
  }

  get autoModeration() {
    return this.rest.autoModeration;
  }
}
