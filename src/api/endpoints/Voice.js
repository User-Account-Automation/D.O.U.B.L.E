export class VoiceEndpoints {
  constructor(rest) {
    this.rest = rest;
  }

  async joinVoiceChannel(guildId, channelId, options = {}) {
    return this.rest.post(`/guilds/${guildId}/voice-states/@me`, {
      body: {
        channel_id: channelId,
        self_mute: options.selfMute || false,
        self_deaf: options.selfDeaf || false
      }
    });
  }

  async leaveVoiceChannel(guildId) {
    return this.rest.delete(`/guilds/${guildId}/voice-states/@me`);
  }

  async getVoiceRegions() {
    return this.rest.get('/voice/regions');
  }
}
