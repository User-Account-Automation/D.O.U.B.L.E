export class EmojiEndpoints {
  constructor(rest) {
    this.rest = rest;
  }

  async getGuildEmojis(guildId) {
    return this.rest.get(`/guilds/${guildId}/emojis`);
  }

  async getGuildEmoji(guildId, emojiId) {
    return this.rest.get(`/guilds/${guildId}/emojis/${emojiId}`);
  }

  async createGuildEmoji(guildId, data) {
    return this.rest.post(`/guilds/${guildId}/emojis`, { body: data });
  }

  async modifyGuildEmoji(guildId, emojiId, data) {
    return this.rest.patch(`/guilds/${guildId}/emojis/${emojiId}`, { body: data });
  }

  async deleteGuildEmoji(guildId, emojiId) {
    return this.rest.delete(`/guilds/${guildId}/emojis/${emojiId}`);
  }
}
