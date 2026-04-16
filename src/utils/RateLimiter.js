export class RateLimiter {
  constructor(options = {}) {
    this.options = {
      mode: options.rateLimitMode || 'conservative',
      requestsPerMinute: options.requestsPerMinute || 30,
      similarActionDelay: options.similarActionDelay || 2000,
      massOperationLimit: options.massOperationLimit || 10,
      ...options
    };

    this.requestHistory = [];
    this.actionTimestamps = new Map();
    this.globalLimit = 50;
    this.globalLimitActive = false;
    this.globalResetTime = null;
    this.cleanupInterval = setInterval(() => {
      this._cleanupHistory();
      this._cleanupActionTimestamps();
    }, 300000);
    this.requestLock = false;
  }

  async waitBeforeRequest(endpoint, method) {
    while (this.requestLock) {
      await this._sleep(50);
    }
    
    this.requestLock = true;
    const now = Date.now();
    
    try {
      await this._enforceGlobalLimit();
      await this._enforceEndpointLimit(endpoint, method);
      await this._enforceSimilarActionDelay(endpoint);
      
      this.requestHistory.push({
        endpoint,
        method,
        timestamp: now
      });
      
      this._cleanupHistory();
      this._cleanupActionTimestamps();
    } finally {
      this.requestLock = false;
    }
  }

  async _enforceGlobalLimit() {
    const now = Date.now();
    
    if (this.globalResetTime && now < this.globalResetTime) {
      const waitTime = this.globalResetTime - now;
      if (waitTime > 0) {
        await this._sleep(waitTime);
      }
    }
    
    if (this.globalResetTime && now >= this.globalResetTime) {
      this.globalResetTime = null;
      this.globalLimitActive = false;
    }
    
    const recentRequests = this.requestHistory.filter(
      req => (now - req.timestamp) < 1000
    );
    
    if (recentRequests.length >= this.globalLimit) {
      this.globalResetTime = now + 1000;
      await this._sleep(1000);
    }
  }

  async _enforceEndpointLimit(endpoint, method) {
    const now = Date.now();
    const key = `${method}:${endpoint}`;
    
    const recentRequests = this.requestHistory.filter(
      req => req.endpoint === endpoint && 
            req.method === method &&
            (now - req.timestamp) < 60000
    );
    
    const limit = this._getEndpointLimit(endpoint, method);
    
    if (recentRequests.length >= limit) {
      const oldestRequest = recentRequests[0];
      const waitTime = 60000 - (now - oldestRequest.timestamp);
      
      if (waitTime > 0) {
        await this._sleep(waitTime);
      }
    }
  }

  async _enforceSimilarActionDelay(endpoint) {
    if (!this.options.humanEmulation) {
      return;
    }

    const now = Date.now();
    const lastAction = this.actionTimestamps.get(endpoint);
    
    if (lastAction) {
      const timeSinceLastAction = now - lastAction;
      const minDelay = this._getHumanLikeDelay(endpoint);
      
      if (timeSinceLastAction < minDelay) {
        const waitTime = minDelay - timeSinceLastAction;
        await this._sleep(waitTime);
      }
    }
    
    this.actionTimestamps.set(endpoint, Date.now());
  }

  _getEndpointLimit(endpoint, method) {
    if (endpoint.includes('/messages')) {
      return method === 'POST' ? 5 : 50;
    }
    
    if (endpoint.includes('/channels')) {
      return 10;
    }
    
    if (endpoint.includes('/guilds')) {
      return 5;
    }
    
    return this.options.requestsPerMinute;
  }

  _getHumanLikeDelay(endpoint) {
    const baseDelay = this.options.similarActionDelay;
    
    if (endpoint.includes('/messages')) {
      return baseDelay + Math.random() * 1000;
    }
    
    if (endpoint.includes('/reactions')) {
      return baseDelay * 0.5 + Math.random() * 500;
    }
    
    return baseDelay + Math.random() * 500;
  }

  _cleanupHistory() {
    const now = Date.now();
    const oneHourAgo = now - 3600000;
    
    this.requestHistory = this.requestHistory.filter(
      req => req.timestamp > oneHourAgo
    );
  }

  _cleanupActionTimestamps() {
    const now = Date.now();
    const fiveMinutesAgo = now - 300000;
    
    for (const [endpoint, timestamp] of this.actionTimestamps.entries()) {
      if (timestamp < fiveMinutesAgo) {
        this.actionTimestamps.delete(endpoint);
      }
    }
  }

  _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getStats() {
    const now = Date.now();
    const recentRequests = this.requestHistory.filter(
      req => (now - req.timestamp) < 60000
    );
    
    return {
      requestsLastMinute: recentRequests.length,
      totalHistorySize: this.requestHistory.length,
      currentLimit: this.options.requestsPerMinute
    };
  }

  reset() {
    this.requestHistory = [];
    this.actionTimestamps.clear();
    this.globalResetTime = null;
    // Clear and recreate cleanup interval to prevent memory leak
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = setInterval(() => {
        this._cleanupHistory();
        this._cleanupActionTimestamps();
      }, 300000);
    }
  }

  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.requestHistory = [];
    this.actionTimestamps.clear();
    this.globalResetTime = null;
  }
}
