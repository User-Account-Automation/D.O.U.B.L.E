export class SafetyManager {
  constructor(options = {}) {
    this.options = {
      safety: options.safety || 'strict',
      autoCooldown: options.autoCooldown !== false,
      humanEmulation: options.humanEmulation !== false,
      auditLogging: options.auditLogging !== false,
      riskWarnings: options.riskWarnings !== false,
      emergencyStop: options.emergencyStop !== false,
      ...options
    };

    this.riskLevel = this._getSafetyLevel();
    this.auditLog = [];
    this.emergencyTriggered = false;
    this.cleanupInterval = setInterval(() => this._cleanupAuditLog(), 300000);
  }

  _getSafetyLevel() {
    const levels = {
      strict: 1,
      moderate: 0.7,
      permissive: 0.4,
      custom: 0.5
    };
    
    return levels[this.options.safety] || levels.strict;
  }

  assessRisk(action, details = {}) {
    if (!action || typeof action !== 'string') {
      throw new Error('Action must be a non-empty string');
    }
    
    if (!details || typeof details !== 'object') {
      details = {};
    }
    
    const riskFactors = this._calculateRiskFactors(action, details);
    const totalRisk = this._aggregateRisk(riskFactors);
    
    if (this.options.riskWarnings && totalRisk > 0.5) {
      this._logRiskWarning(action, totalRisk, riskFactors);
    }
    
    if (this.options.emergencyStop && totalRisk > 0.9) {
      this._triggerEmergency(action, totalRisk);
    }
    
    const threshold = this.riskLevel === 1 ? 0.3 : (1 - this.riskLevel * 0.3);
    
    return {
      risk: totalRisk,
      factors: riskFactors,
      allowed: totalRisk < threshold
    };
  }

  _calculateRiskFactors(action, details) {
    const factors = {
      actionType: this._getActionTypeRisk(action),
      frequency: this._getFrequencyRisk(action),
      content: this._getContentRisk(details),
      timing: this._getTimingRisk(),
      volume: this._getVolumeRisk(details)
    };
    
    return factors;
  }

  _getActionTypeRisk(action) {
    const highRiskActions = ['massDelete', 'massBan', 'spam', 'bulkMessage'];
    const mediumRiskActions = ['delete', 'ban', 'kick', 'message'];
    
    if (highRiskActions.some(risky => action.includes(risky))) {
      return 0.8;
    }
    
    if (mediumRiskActions.some(risky => action.includes(risky))) {
      return 0.5;
    }
    
    return 0.2;
  }

  _getFrequencyRisk(action) {
    const recentActions = this.auditLog.filter(
      log => log.action === action && 
            (Date.now() - log.timestamp) < 60000
    );
    
    const frequency = recentActions.length;
    
    if (frequency > 20) return 0.9;
    if (frequency > 10) return 0.7;
    if (frequency > 5) return 0.5;
    if (frequency > 2) return 0.3;
    
    return 0.1;
  }

  _getContentRisk(details) {
    if (!details || !details.content) {
      return 0;
    }
    
    const spamPatterns = [
      /(.)\1{4,}/,
      /https?:\/\/\S+/gi,
      /\b(?:buy|sell|free|gift|nitro)\b/gi
    ];
    
    let risk = 0;
    for (const pattern of spamPatterns) {
      if (pattern.test(details.content)) {
        risk += 0.3;
      }
    }
    
    return Math.min(risk, 0.8);
  }

  _getTimingRisk() {
    const hour = new Date().getHours();
    
    if (hour >= 2 && hour <= 6) {
      return 0.2;
    }
    
    return 0;
  }

  _getVolumeRisk(details) {
    if (!details || !details.count) {
      return 0;
    }
    
    if (details.count > 10) {
      return 0.8;
    }
    
    if (details.count > 5) {
      return 0.5;
    }
    
    return 0;
  }

  _aggregateRisk(factors) {
    const weights = {
      actionType: 0.3,
      frequency: 0.3,
      content: 0.2,
      timing: 0.1,
      volume: 0.1
    };
    
    let totalRisk = 0;
    for (const [factor, value] of Object.entries(factors)) {
      totalRisk += value * weights[factor];
    }
    
    return Math.min(totalRisk, 1);
  }

  _logRiskWarning(action, risk, factors) {
    const warning = {
      timestamp: Date.now(),
      action,
      risk: risk.toFixed(2),
      factors,
      type: 'warning'
    };
    
    this.auditLog.push(warning);
    this._cleanupAuditLog();
    console.warn(`[Safety Warning] High risk action detected: ${action} (risk: ${(risk * 100).toFixed(0)}%)`);
  }

  _triggerEmergency(action, risk) {
    this.emergencyTriggered = true;
    const emergency = {
      timestamp: Date.now(),
      action,
      risk: risk.toFixed(2),
      type: 'emergency'
    };
    
    this.auditLog.push(emergency);
    this._cleanupAuditLog();
    console.error(`[EMERGENCY STOP] Action blocked: ${action} (risk: ${(risk * 100).toFixed(0)}%)`);
    
    throw new Error(`Emergency stop triggered due to high risk action: ${action}`);
  }

  logAction(action, details = {}) {
    if (!this.options.auditLogging) {
      this._cleanupAuditLog();
      return;
    }
    
    const logEntry = {
      timestamp: Date.now(),
      action,
      ...details,
      type: 'action'
    };
    
    this.auditLog.push(logEntry);
    this._cleanupAuditLog();
  }

  _cleanupAuditLog() {
    const now = Date.now();
    const oneHourAgo = now - 3600000;
    
    this.auditLog = this.auditLog.filter(log => log.timestamp > oneHourAgo);
    
    if (this.auditLog.length > 1000) {
      this.auditLog = this.auditLog.slice(-500);
    }
  }

  getAuditLog(limit = 50) {
    return this.auditLog.slice(-limit);
  }

  getRiskScore() {
    const recentLogs = this.auditLog.filter(
      log => (Date.now() - log.timestamp) < 3600000
    );
    
    const warnings = recentLogs.filter(log => log.type === 'warning').length;
    const actions = recentLogs.filter(log => log.type === 'action').length;
    
    if (actions === 0) return 0;
    
    return warnings / actions;
  }

  reset() {
    this.auditLog = [];
    this.emergencyTriggered = false;
    // Clear and recreate cleanup interval to prevent memory leak
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = setInterval(() => this._cleanupAuditLog(), 300000);
    }
  }

  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.auditLog = [];
    this.emergencyTriggered = false;
  }
}
