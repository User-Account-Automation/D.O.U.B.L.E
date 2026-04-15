export class TokenManager {
  constructor(token) {
    this.token = null;
    this.tokenSource = null;
    this.initialized = false;
    
    this._initializeToken(token);
  }

  _initializeToken(token) {
    if (token) {
      if (typeof token !== 'string') {
        throw new Error('Token must be a string');
      }
      
      if (token.includes(' ') || token.includes('\n') || token.includes('\t')) {
        throw new Error('Token contains whitespace - this may indicate it was hardcoded');
      }
      
      this.token = token.trim();
      this.tokenSource = 'parameter';
    } else {
      const envToken = process.env.DISCORD_TOKEN;
      if (envToken) {
        this.token = envToken.trim();
        this.tokenSource = 'environment';
      }
    }
    
    this.initialized = true;
  }

  getToken() {
    if (!this.token) {
      throw new Error('No token provided. Set it via options.token or DISCORD_TOKEN environment variable');
    }
    return this.token;
  }

  async validateToken(token) {
    if (!token) {
      throw new Error('Token is required for validation');
    }

    if (!this._isValidTokenFormat(token)) {
      throw new Error('Invalid token format. Discord tokens should be base64 encoded with dots');
    }

    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      throw new Error('Invalid token structure. Expected 3 parts separated by dots');
    }

    try {
      const userId = this._decodeUserId(tokenParts[0]);
      if (!userId || isNaN(userId)) {
        throw new Error('Invalid user ID in token');
      }
    } catch (error) {
      throw new Error('Failed to decode token: ' + error.message);
    }

    return true;
  }

  _isValidTokenFormat(token) {
    if (typeof token !== 'string') {
      return false;
    }
    
    if (token.length < 50) {
      return false;
    }
    
    const parts = token.split('.');
    return parts.length === 3;
  }

  _decodeUserId(base64Part) {
    try {
      const decoded = Buffer.from(base64Part, 'base64').toString('utf-8');
      return decoded;
    } catch (error) {
      throw new Error('Failed to decode user ID from token');
    }
  }

  getTokenSource() {
    return this.tokenSource;
  }

  rotateToken(newToken) {
    if (!newToken || typeof newToken !== 'string') {
      throw new Error('New token must be a non-empty string');
    }

    this._initializeToken(newToken);
  }

  maskToken() {
    if (!this.token) {
      return 'No token set';
    }
    
    const parts = this.token.split('.');
    if (parts.length === 3 && parts[0] && parts[2]) {
      const firstPart = parts[0].length > 8 ? parts[0].substring(0, 8) : parts[0];
      const lastPart = parts[2].length > 8 ? parts[2].substring(0, 8) : parts[2];
      return `${firstPart}...${lastPart}`;
    }
    
    return this.token.length > 8 ? this.token.substring(0, 8) + '...' : this.token + '...';
  }
}
