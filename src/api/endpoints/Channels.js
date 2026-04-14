export class ChannelEndpoints {
  constructor(rest) {
    this.rest = rest;
  }

  async getChannel(channelId) {
    return this.rest.get(`/channels/${channelId}`);
  }

  async modifyChannel(channelId, data) {
    return this.rest.patch(`/channels/${channelId}`, { body: data });
  }

  async deleteChannel(channelId) {
    return this.rest.delete(`/channels/${channelId}`);
  }

  async getMessages(channelId, options = {}) {
    const params = new URLSearchParams();
    if (options.limit) params.append('limit', options.limit);
    if (options.before) params.append('before', options.before);
    if (options.after) params.append('after', options.after);
    
    return this.rest.get(`/channels/${channelId}/messages?${params}`);
  }

  async getMessage(channelId, messageId) {
    return this.rest.get(`/channels/${channelId}/messages/${messageId}`);
  }

  async sendMessage(channelId, data) {
    return this.rest.post(`/channels/${channelId}/messages`, { body: data });
  }

  async editMessage(channelId, messageId, data) {
    return this.rest.patch(`/channels/${channelId}/messages/${messageId}`, { body: data });
  }

  async deleteMessage(channelId, messageId) {
    return this.rest.delete(`/channels/${channelId}/messages/${messageId}`);
  }

  async bulkDeleteMessages(channelId, messageIds) {
    return this.rest.post(`/channels/${channelId}/messages/bulk-delete`, {
      body: { messages: messageIds }
    });
  }

  async addReaction(channelId, messageId, emoji) {
    return this.rest.put(`/channels/${channelId}/messages/${messageId}/reactions/${emoji}/@me`);
  }

  async removeReaction(channelId, messageId, emoji) {
    return this.rest.delete(`/channels/${channelId}/messages/${messageId}/reactions/${emoji}/@me`);
  }

  async getReactions(channelId, messageId, emoji) {
    return this.rest.get(`/channels/${channelId}/messages/${messageId}/reactions/${emoji}`);
  }
}
