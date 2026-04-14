export class Logger {
  constructor(options = {}) {
    this.options = {
      level: options.level || 'info',
      enableConsole: options.enableConsole !== false,
      enableFile: options.enableFile || false,
      ...options
    };

    this.levels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3
    };

    this.currentLevel = this.levels[this.options.level] || this.levels.info;
  }

  error(message, meta = {}) {
    if (this.currentLevel >= this.levels.error) {
      this._log('error', message, meta);
    }
  }

  warn(message, meta = {}) {
    if (this.currentLevel >= this.levels.warn) {
      this._log('warn', message, meta);
    }
  }

  info(message, meta = {}) {
    if (this.currentLevel >= this.levels.info) {
      this._log('info', message, meta);
    }
  }

  debug(message, meta = {}) {
    if (this.currentLevel >= this.levels.debug) {
      this._log('debug', message, meta);
    }
  }

  _log(level, message, meta) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...meta
    };

    if (this.options.enableConsole) {
      const consoleMethod = level === 'error' ? console.error : 
                            level === 'warn' ? console.warn : 
                            level === 'debug' ? console.debug : console.log;
      
      consoleMethod(`[${timestamp}] [${level.toUpperCase()}]`, message, meta);
    }

    return logEntry;
  }

  maskSensitiveData(data) {
    if (!data || typeof data !== 'object') {
      return data;
    }

    const sensitiveKeys = ['token', 'password', 'secret', 'key', 'authorization'];
    const masked = {};

    for (const [key, value] of Object.entries(data)) {
      const lowerKey = key.toLowerCase();
      if (sensitiveKeys.some(sensitive => lowerKey.includes(sensitive))) {
        masked[key] = this._maskValue(value);
      } else if (typeof value === 'object' && value !== null) {
        masked[key] = this.maskSensitiveData(value);
      } else {
        masked[key] = value;
      }
    }

    return masked;
  }

  _maskValue(value) {
    if (typeof value !== 'string') {
      return '[REDACTED]';
    }
    
    if (value.length <= 8) {
      return '[REDACTED]';
    }
    
    return value.substring(0, 4) + '...' + value.substring(value.length - 4);
  }
}
