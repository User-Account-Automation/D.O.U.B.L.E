export class DoubleError extends Error {
  constructor(message, code = 'UNKNOWN_ERROR') {
    super(message);
    this.name = 'DoubleError';
    this.code = code;
  }
}

export class TokenError extends DoubleError {
  constructor(message) {
    super(message, 'TOKEN_ERROR');
    this.name = 'TokenError';
  }
}

export class RateLimitError extends DoubleError {
  constructor(message, retryAfter) {
    super(message, 'RATE_LIMIT_ERROR');
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }
}

export class SafetyError extends DoubleError {
  constructor(message, riskLevel) {
    super(message, 'SAFETY_ERROR');
    this.name = 'SafetyError';
    this.riskLevel = riskLevel;
  }
}

export class ConnectionError extends DoubleError {
  constructor(message) {
    super(message, 'CONNECTION_ERROR');
    this.name = 'ConnectionError';
  }
}

export class ValidationError extends DoubleError {
  constructor(message, field) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
    this.field = field;
  }
}

export class APIError extends DoubleError {
  constructor(message, statusCode, method, endpoint) {
    super(message, 'API_ERROR');
    this.name = 'APIError';
    this.statusCode = statusCode;
    this.method = method;
    this.endpoint = endpoint;
  }
}

export class EmergencyStopError extends DoubleError {
  constructor(message, action, risk) {
    super(message, 'EMERGENCY_STOP');
    this.name = 'EmergencyStopError';
    this.action = action;
    this.risk = risk;
  }
}
