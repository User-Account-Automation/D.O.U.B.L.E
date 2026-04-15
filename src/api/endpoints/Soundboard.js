/**
 * Soundboard Endpoints
 * 
 * Provides methods for managing Discord soundboard sounds.
 * Soundboard allows users to play audio in voice channels.
 * 
 * @example
 * import { Client } from 'double';
 * const client = new Client({ token });
 * await client.connect();
 * 
 * // Get soundboard sounds for a guild
 * const sounds = await client.soundboard.getSounds('guild_id');
 * 
 * // Create a new sound
 * const sound = await client.soundboard.createSound('guild_id', {
 *   name: 'Funny Sound',
 *   volume: 0.5
 * });
 */

export class SoundboardEndpoints {
  constructor(rest) {
    this.rest = rest;
  }

  /**
   * Gets all soundboard sounds for a guild.
   * 
   * @param {string} guildId - The guild ID
   * @returns {Promise<Array>} Array of sound objects
   * 
   * @example
   * const sounds = await soundboard.getSounds('123456789');
   * sounds.forEach(sound => {
   *   console.log(`${sound.name}: ${sound.volume}`);
   * });
   */
  async getSounds(guildId) {
    return this.rest.get(`/guilds/${guildId}/soundboard-sounds`);
  }

  /**
   * Gets a specific soundboard sound.
   * 
   * @param {string} soundId - The sound ID
   * @returns {Promise<Object>} The sound object
   * 
   * @example
   * const sound = await soundboard.getSound('sound_id');
   */
  async getSound(soundId) {
    return this.rest.get(`/soundboard-sounds/${soundId}`);
  }

  /**
   * Creates a new soundboard sound.
   * Requires CREATE_EXPRESSIONS permission.
   * 
   * @param {string} guildId - The guild ID
   * @param {Object} data - Sound data
   * @param {string} data.name - The sound name (2-32 characters)
   * @param {string} data.sound - Base64 encoded audio data
   * @param {number} [data.volume] - Volume level (0.0-1.0)
   * @param {string} [data.emoji_id] - Custom emoji ID for the sound
   * @param {string} [data.emoji_name] - Unicode emoji for the sound
   * @returns {Promise<Object>} The created sound object
   * 
   * @example
   * const sound = await soundboard.createSound('123456789', {
   *   name: 'My Sound',
   *   sound: 'base64_encoded_audio',
   *   volume: 0.75,
   *   emoji_name: '🔊'
   * });
   */
  async createSound(guildId, data) {
    const body = {
      name: data.name,
      sound: data.sound
    };
    
    if (data.volume !== undefined) body.volume = data.volume;
    if (data.emoji_id) body.emoji_id = data.emoji_id;
    if (data.emoji_name) body.emoji_name = data.emoji_name;
    
    return this.rest.post(`/guilds/${guildId}/soundboard-sounds`, { body });
  }

  /**
   * Modifies a soundboard sound.
   * Requires CREATE_EXPRESSIONS permission.
   * 
   * @param {string} soundId - The sound ID
   * @param {Object} data - Sound modification data
   * @param {string} [data.name] - The new sound name
   * @param {number} [data.volume] - The new volume level
   * @param {string} [data.emoji_id] - The new custom emoji ID
   * @param {string} [data.emoji_name] - The new unicode emoji
   * @returns {Promise<Object>} The modified sound object
   * 
   * @example
   * const sound = await soundboard.modifySound('sound_id', {
   *   name: 'Updated Name',
   *   volume: 0.9
   * });
   */
  async modifySound(soundId, data) {
    return this.rest.patch(`/soundboard-sounds/${soundId}`, { body: data });
  }

  /**
   * Deletes a soundboard sound.
   * Requires CREATE_EXPRESSIONS permission.
   * 
   * @param {string} soundId - The sound ID
   * @returns {Promise<Object>} Empty object on success
   * 
   * @example
   * await soundboard.deleteSound('sound_id');
   */
  async deleteSound(soundId) {
    return this.rest.delete(`/soundboard-sounds/${soundId}`);
  }
}
