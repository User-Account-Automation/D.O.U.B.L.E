/**
 * Voice Endpoints
 * 
 * Provides methods for managing Discord voice channels and voice states.
 * This includes joining/leaving voice channels and managing voice regions.
 * 
 * @example
 * import { Client } from 'double';
 * const client = new Client({ token });
 * await client.connect();
 * 
 * // Join a voice channel
 * await client.voice.joinVoiceChannel('guild_id', 'channel_id', {
 *   selfMute: false,
 *   selfDeaf: false
 * });
 * 
 * // Leave the voice channel
 * await client.voice.leaveVoiceChannel('guild_id');
 */

export class VoiceEndpoints {
  constructor(rest) {
    this.rest = rest;
  }

  /**
   * Joins a voice channel.
   * Requires CONNECT permission.
   * 
   * @param {string} guildId - The guild ID
   * @param {string} channelId - The voice channel ID
   * @param {Object} [options] - Voice options
   * @param {boolean} [options.selfMute] - Whether to mute self
   * @param {boolean} [options.selfDeaf] - Whether to deafen self
   * @returns {Promise<Object>} The voice state object
   * 
   * @example
   * const state = await voice.joinVoiceChannel('123456789', 'channel_id', {
   *   selfMute: false,
   *   selfDeaf: true
   * });
   */
  async joinVoiceChannel(guildId, channelId, options = {}) {
    return this.rest.post(`/guilds/${guildId}/voice-states/@me`, {
      body: {
        channel_id: channelId,
        self_mute: options.selfMute || false,
        self_deaf: options.selfDeaf || false
      }
    });
  }

  /**
   * Leaves a voice channel.
   * 
   * @param {string} guildId - The guild ID
   * @returns {Promise<Object>} Empty object on success
   * 
   * @example
   * await voice.leaveVoiceChannel('123456789');
   */
  async leaveVoiceChannel(guildId) {
    return this.rest.delete(`/guilds/${guildId}/voice-states/@me`);
  }

  /**
   * Gets available voice regions.
   * 
   * @returns {Promise<Array>} Array of voice region objects
   * 
   * @example
   * const regions = await voice.getVoiceRegions();
   * regions.forEach(region => {
   *   console.log(`${region.name}: ${region.deprecated ? 'deprecated' : 'available'}`);
   * });
   */
  async getVoiceRegions() {
    return this.rest.get('/voice/regions');
  }
}
