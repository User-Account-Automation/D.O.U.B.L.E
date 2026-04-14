import WebSocket from 'ws';
import { ConnectionError } from '../utils/Errors.js';

export class Gateway {
  constructor(client) {
    this.client = client;
    this.ws = null;
    this.heartbeatInterval = null;
    this.heartbeatIntervalId = null;
    this.sequence = null;
    this.sessionId = null;
    this.connected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectTimeout = null;
    this.reconnecting = false;
    
    this.eventHandlers = new Map();
    this.ready = false;
    this.wsEventHandlers = null;
  }

  async connect(token) {
    try {
      const gatewayURL = await this._getGatewayURL();
      
      return new Promise((resolve, reject) => {
        this.ws = new WebSocket(gatewayURL);
        
        const onOpen = () => {
          this.connected = true;
          this._sendIdentify(token);
          this.client.logger.info('Gateway connected');
        };
        
        const onMessage = (data) => {
          try {
            this._handleMessage(JSON.parse(data));
          } catch (error) {
            this.client.logger.error('Failed to parse gateway message', { error: error.message });
          }
        };
        
        const onClose = (code, reason) => {
          this.connected = false;
          this._handleDisconnect(code, reason);
        };
        
        const onError = (error) => {
          this.client.logger.error('Gateway error:', error);
          if (!this.connected) {
            reject(new ConnectionError(`Gateway connection failed: ${error.message}`));
          }
        };
        
        this.wsEventHandlers = { onOpen, onMessage, onClose, onError };
        
        this.ws.on('open', onOpen);
        this.ws.on('message', onMessage);
        this.ws.on('close', onClose);
        this.ws.on('error', onError);
        
        this.ws.once('ready', () => {
          resolve();
        });
      });
    } catch (error) {
      throw new ConnectionError(`Failed to connect to gateway: ${error.message}`);
    }
  }

  async _getGatewayURL() {
    try {
      const response = await this.client.rest.get('/gateway');
      return response.url;
    } catch (error) {
      return 'wss://gateway.discord.gg';
    }
  }

  _sendIdentify(token) {
    const payload = {
      op: 2,
      d: {
        token: token,
        properties: {
          os: 'Windows',
          browser: 'Chrome',
          device: 'Chrome'
        },
        compress: false,
        large_threshold: 50,
        intents: 513
      }
    };
    
    this._send(payload);
  }

  _send(payload) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(payload));
    }
  }

  _handleMessage(data) {
    const { op, d, t, s } = data;
    
    if (s) {
      this.sequence = s;
    }
    
    switch (op) {
      case 0:
        this._handleEvent(t, d);
        break;
      case 1:
        this._sendHeartbeat();
        break;
      case 10:
        this._handleHello(d);
        break;
      case 11:
        this._handleHeartbeatAck();
        break;
      default:
        console.log('Unknown opcode:', op);
    }
  }

  _handleEvent(event, data) {
    if (event === 'READY') {
      this.ready = true;
      this.sessionId = data.session_id;
      this.ws.emit('ready');
      console.log('Gateway ready');
    }
    
    this._emit(event, data);
  }

  _handleHello(data) {
    this.heartbeatInterval = data.heartbeat_interval;
    this._startHeartbeat();
  }

  _handleHeartbeatAck() {
  }

  _startHeartbeat() {
    if (this.heartbeatInterval) {
      if (this.heartbeatIntervalId) {
        clearInterval(this.heartbeatIntervalId);
      }
      this.heartbeatIntervalId = setInterval(() => {
        this._sendHeartbeat();
      }, this.heartbeatInterval);
    }
  }

  _sendHeartbeat() {
    this._send({
      op: 1,
      d: this.sequence
    });
  }

  _handleDisconnect(code, reason) {
    console.log(`Gateway disconnected: ${code} - ${reason}`);
    
    if (this.heartbeatIntervalId) {
      clearInterval(this.heartbeatIntervalId);
      this.heartbeatIntervalId = null;
    }
    
    if (code === 4000 || code === 4001) {
      this._attemptReconnect();
    }
  }

  async _attemptReconnect() {
    if (this.reconnecting) {
      return;
    }
    
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      this.reconnecting = false;
      return;
    }
    
    this.reconnecting = true;
    this.reconnectAttempts++;
    const delay = Math.pow(2, this.reconnectAttempts) * 1000;
    
    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    await this._sleep(delay);
    
    try {
      const token = this.client.tokenManager.getToken();
      await this.connect(token);
      this.reconnectAttempts = 0;
      this.reconnecting = false;
    } catch (error) {
      console.error('Reconnection failed:', error);
      this.reconnecting = false;
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
      }
      this.reconnectTimeout = setTimeout(() => this._attemptReconnect(), 1000);
    }
  }

  _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  on(event, handler) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event).push(handler);
  }

  _emit(event, data) {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      for (const handler of handlers) {
        try {
          handler(data);
        } catch (error) {
          console.error(`Error in event handler for ${event}:`, error);
        }
      }
    }
  }

  async disconnect() {
    try {
      if (this.heartbeatIntervalId) {
        clearInterval(this.heartbeatIntervalId);
        this.heartbeatIntervalId = null;
      }
      
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = null;
      }
      
      if (this.ws && this.wsEventHandlers) {
        this.ws.removeListener('open', this.wsEventHandlers.onOpen);
        this.ws.removeListener('message', this.wsEventHandlers.onMessage);
        this.ws.removeListener('close', this.wsEventHandlers.onClose);
        this.ws.removeListener('error', this.wsEventHandlers.onError);
        this.wsEventHandlers = null;
      }
      
      if (this.ws) {
        this.ws.close(1000, 'Normal closure');
        this.ws = null;
        this.connected = false;
        this.ready = false;
      }
      
      this.eventHandlers.clear();
      this.client.logger.info('Gateway disconnected successfully');
    } catch (error) {
      this.client.logger.error('Error during gateway disconnect', { error: error.message });
    }
  }

  off(event, handler) {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
      if (handlers.length === 0) {
        this.eventHandlers.delete(event);
      }
    }
  }
}
