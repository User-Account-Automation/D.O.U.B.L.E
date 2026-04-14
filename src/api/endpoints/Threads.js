export class ThreadEndpoints {
  constructor(rest) {
    this.rest = rest;
  }

  async getThread(channelId) {
    return this.rest.get(`/channels/${channelId}`);
  }

  async modifyThread(channelId, data) {
    return this.rest.patch(`/channels/${channelId}`, { body: data });
  }

  async deleteThread(channelId) {
    return this.rest.delete(`/channels/${channelId}`);
  }

  async joinThread(channelId) {
    return this.rest.put(`/channels/${channelId}/thread-members/@me`);
  }

  async leaveThread(channelId) {
    return this.rest.delete(`/channels/${channelId}/thread-members/@me`);
  }

  async addThreadMember(channelId, userId) {
    return this.rest.put(`/channels/${channelId}/thread-members/${userId}`);
  }

  async removeThreadMember(channelId, userId) {
    return this.rest.delete(`/channels/${channelId}/thread-members/${userId}`);
  }

  async getThreadMembers(channelId) {
    return this.rest.get(`/channels/${channelId}/thread-members`);
  }

  async getArchivedThreads(channelId, type = 'public', options = {}) {
    const params = new URLSearchParams();
    if (options.before) params.append('before', options.before);
    if (options.limit) params.append('limit', options.limit);
    
    return this.rest.get(`/channels/${channelId}/threads/archived/${type}?${params}`);
  }

  async startThread(parentChannelId, data) {
    return this.rest.post(`/channels/${parentChannelId}/threads`, { body: data });
  }

  async startThreadInForum(channelId, data) {
    return this.rest.post(`/channels/${channelId}/threads`, { body: data });
  }
}
