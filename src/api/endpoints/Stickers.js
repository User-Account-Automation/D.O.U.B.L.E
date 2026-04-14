export class StickerEndpoints {
  constructor(rest) {
    this.rest = rest;
  }

  async getSticker(stickerId) {
    return this.rest.get(`/stickers/${stickerId}`);
  }

  async getStickerPack(stickerPackId) {
    return this.rest.get(`/sticker-packs/${stickerPackId}`);
  }

  async listStickerPacks() {
    return this.rest.get('/sticker-packs');
  }

  async getGuildStickers(guildId) {
    return this.rest.get(`/guilds/${guildId}/stickers`);
  }

  async getGuildSticker(guildId, stickerId) {
    return this.rest.get(`/guilds/${guildId}/stickers/${stickerId}`);
  }

  async createGuildSticker(guildId, data) {
    return this.rest.post(`/guilds/${guildId}/stickers`, { body: data });
  }

  async modifyGuildSticker(guildId, stickerId, data) {
    return this.rest.patch(`/guilds/${guildId}/stickers/${stickerId}`, { body: data });
  }

  async deleteGuildSticker(guildId, stickerId) {
    return this.rest.delete(`/guilds/${guildId}/stickers/${stickerId}`);
  }
}
