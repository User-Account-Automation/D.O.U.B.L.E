export class WebhookEndpoints {
  constructor(rest) {
    this.rest = rest;
  }

  async getWebhook(webhookId, webhookToken) {
    return this.rest.get(`/webhooks/${webhookId}${webhookToken ? `/${webhookToken}` : ''}`);
  }

  async createWebhook(channelId, data) {
    return this.rest.post(`/channels/${channelId}/webhooks`, { body: data });
  }

  async modifyWebhook(webhookId, data, webhookToken) {
    const token = webhookToken ? `/${webhookToken}` : '';
    return this.rest.patch(`/webhooks/${webhookId}${token}`, { body: data });
  }

  async deleteWebhook(webhookId, webhookToken) {
    const token = webhookToken ? `/${webhookToken}` : '';
    return this.rest.delete(`/webhooks/${webhookId}${token}`);
  }

  async executeWebhook(webhookId, webhookToken, data) {
    return this.rest.post(`/webhooks/${webhookId}/${webhookToken}`, { body: data });
  }

  async executeSlackWebhook(webhookId, webhookToken, data) {
    return this.rest.post(`/webhooks/${webhookId}/${webhookToken}/slack`, { body: data });
  }

  async executeGitHubWebhook(webhookId, webhookToken, data) {
    return this.rest.post(`/webhooks/${webhookId}/${webhookToken}/github`, { body: data });
  }
}
