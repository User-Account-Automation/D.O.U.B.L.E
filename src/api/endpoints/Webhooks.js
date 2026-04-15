/**
 * Webhook Endpoints
 * 
 * Provides methods for managing Discord webhooks and executing webhook messages.
 * Webhooks allow external services to send messages to Discord channels.
 * 
 * @example
 * import { Client } from 'double';
 * const client = new Client({ token });
 * await client.connect();
 * 
 * // Get a webhook
 * const webhook = await client.webhooks.getWebhook('webhook_id', 'webhook_token');
 * 
 * // Execute the webhook
 * await client.webhooks.executeWebhook('webhook_id', 'webhook_token', {
 *   content: 'Hello from webhook!'
 * });
 */

export class WebhookEndpoints {
  constructor(rest) {
    this.rest = rest;
  }

  /**
   * Gets a webhook by ID.
   * Requires MANAGE_WEBHOOKS permission.
   * 
   * @param {string} webhookId - The webhook ID
   * @param {string} [webhookToken] - The webhook token (for webhooks without token)
   * @returns {Promise<Object>} The webhook object
   * 
   * @example
   * const webhook = await webhooks.getWebhook('webhook_id');
   */
  async getWebhook(webhookId, webhookToken) {
    return this.rest.get(`/webhooks/${webhookId}${webhookToken ? `/${webhookToken}` : ''}`);
  }

  /**
   * Creates a webhook in a channel.
   * Requires MANAGE_WEBHOOKS permission.
   * 
   * @param {string} channelId - The channel ID
   * @param {Object} data - Webhook data
   * @param {string} data.name - The webhook name (2-32 characters)
   * @param {string} [data.avatar] - Base64 encoded avatar
   * @returns {Promise<Object>} The created webhook object
   * 
   * @example
   * const webhook = await webhooks.createWebhook('123456789', {
   *   name: 'My Webhook'
   * });
   */
  async createWebhook(channelId, data) {
    return this.rest.post(`/channels/${channelId}/webhooks`, { body: data });
  }

  /**
   * Modifies a webhook.
   * Requires MANAGE_WEBHOOKS permission.
   * 
   * @param {string} webhookId - The webhook ID
   * @param {Object} data - Webhook modification data
   * @param {string} [webhookToken] - The webhook token
   * @returns {Promise<Object>} The modified webhook object
   * 
   * @example
   * const webhook = await webhooks.modifyWebhook('webhook_id', {
   *   name: 'Updated Name'
   * });
   */
  async modifyWebhook(webhookId, data, webhookToken) {
    const token = webhookToken ? `/${webhookToken}` : '';
    return this.rest.patch(`/webhooks/${webhookId}${token}`, { body: data });
  }

  /**
   * Deletes a webhook.
   * Requires MANAGE_WEBHOOKS permission.
   * 
   * @param {string} webhookId - The webhook ID
   * @param {string} [webhookToken] - The webhook token
   * @returns {Promise<Object>} Empty object on success
   * 
   * @example
   * await webhooks.deleteWebhook('webhook_id');
   */
  async deleteWebhook(webhookId, webhookToken) {
    const token = webhookToken ? `/${webhookToken}` : '';
    return this.rest.delete(`/webhooks/${webhookId}${token}`);
  }

  /**
   * Executes a webhook.
   * 
   * @param {string} webhookId - The webhook ID
   * @param {string} webhookToken - The webhook token
   * @param {Object} data - Message data
   * @param {string} [data.content] - Message content
   * @param {string} [data.username] - Override username
   * @param {string} [data.avatar_url] - Override avatar
   * @param {boolean} [data.tts] - Whether this is a TTS message
   * @param {Array<Object>} [data.embeds] - Array of embeds
   * @returns {Promise<Object>} The created message object
   * 
   * @example
   * const message = await webhooks.executeWebhook('webhook_id', 'webhook_token', {
   *   content: 'Hello from webhook!'
   * });
   */
  async executeWebhook(webhookId, webhookToken, data) {
    return this.rest.post(`/webhooks/${webhookId}/${webhookToken}`, { body: data });
  }

  /**
   * Executes a Slack-compatible webhook.
   * 
   * @param {string} webhookId - The webhook ID
   * @param {string} webhookToken - The webhook token
   * @param {Object} data - Slack-compatible data
   * @returns {Promise<Object>} The created message object
   * 
   * @example
   * const message = await webhooks.executeSlackWebhook('webhook_id', 'webhook_token', {
   *   text: 'Hello from Slack!'
   * });
   */
  async executeSlackWebhook(webhookId, webhookToken, data) {
    return this.rest.post(`/webhooks/${webhookId}/${webhookToken}/slack`, { body: data });
  }

  /**
   * Executes a GitHub-compatible webhook.
   * 
   * @param {string} webhookId - The webhook ID
   * @param {string} webhookToken - The webhook token
   * @param {Object} data - GitHub-compatible data
   * @returns {Promise<Object>} The created message object
   * 
   * @example
   * const message = await webhooks.executeGitHubWebhook('webhook_id', 'webhook_token', {
   *   text: 'Hello from GitHub!'
   * });
   */
  async executeGitHubWebhook(webhookId, webhookToken, data) {
    return this.rest.post(`/webhooks/${webhookId}/${webhookToken}/github`, { body: data });
  }

  /**
   * Gets a message sent by a webhook.
   * 
   * @param {string} webhookId - The webhook ID
   * @param {string} webhookToken - The webhook token
   * @param {string} messageId - The message ID
   * @returns {Promise<Object>} The message object
   * 
   * @example
   * const message = await webhooks.getWebhookMessage('webhook_id', 'webhook_token', 'message_id');
   */
  async getWebhookMessage(webhookId, webhookToken, messageId) {
    return this.rest.get(`/webhooks/${webhookId}/${webhookToken}/messages/${messageId}`);
  }

  /**
   * Edits a message sent by a webhook.
   * 
   * @param {string} webhookId - The webhook ID
   * @param {string} webhookToken - The webhook token
   * @param {string} messageId - The message ID
   * @param {Object} data - Message edit data
   * @returns {Promise<Object>} The edited message object
   * 
   * @example
   * const message = await webhooks.editWebhookMessage('webhook_id', 'webhook_token', 'message_id', {
   *   content: 'Updated message'
   * });
   */
  async editWebhookMessage(webhookId, webhookToken, messageId, data) {
    return this.rest.patch(`/webhooks/${webhookId}/${webhookToken}/messages/${messageId}`, { body: data });
  }

  /**
   * Deletes a message sent by a webhook.
   * 
   * @param {string} webhookId - The webhook ID
   * @param {string} webhookToken - The webhook token
   * @param {string} messageId - The message ID
   * @returns {Promise<Object>} Empty object on success
   * 
   * @example
   * await webhooks.deleteWebhookMessage('webhook_id', 'webhook_token', 'message_id');
   */
  async deleteWebhookMessage(webhookId, webhookToken, messageId) {
    return this.rest.delete(`/webhooks/${webhookId}/${webhookToken}/messages/${messageId}`);
  }
}
