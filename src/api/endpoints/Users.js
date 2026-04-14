export class UserEndpoints {
  constructor(rest) {
    this.rest = rest;
  }

  async getUser(userId) {
    return this.rest.get(`/users/${userId}`);
  }

  async getCurrentUser() {
    return this.rest.get('/users/@me');
  }

  async modifyCurrentUser(data) {
    return this.rest.patch('/users/@me', { body: data });
  }

  async getCurrentUserGuilds(options = {}) {
    const params = new URLSearchParams();
    if (options.limit) params.append('limit', options.limit);
    if (options.before) params.append('before', options.before);
    if (options.after) params.append('after', options.after);
    
    return this.rest.get(`/users/@me/guilds?${params}`);
  }

  async leaveGuild(guildId) {
    return this.rest.delete(`/users/@me/guilds/${guildId}`);
  }

  async getUserDMs() {
    return this.rest.get('/users/@me/channels');
  }

  async createDM(userId) {
    return this.rest.post('/users/@me/channels', {
      body: { recipient_id: userId }
    });
  }

  async getUserConnections() {
    return this.rest.get('/users/@me/connections');
  }

  async getUserSettings() {
    return this.rest.get('/users/@me/settings');
  }

  async modifyUserSettings(data) {
    return this.rest.patch('/users/@me/settings', { body: data });
  }
}
