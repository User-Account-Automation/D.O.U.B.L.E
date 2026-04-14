/**
 * Stage Channel Endpoints
 * 
 * Provides methods for managing Discord stage channels.
 * Stage channels are used for live audio events with speakers and audience.
 * 
 * @example
 * import { Client } from 'double';
 * const client = new Client({ token });
 * await client.connect();
 * 
 * // Get stage instance
 * const stage = await client.stageChannels.getStageInstance('channel_id');
 * 
 * // Create a stage instance
 * const instance = await client.stageChannels.createStageInstance('channel_id', {
 *   topic: 'Live Discussion'
 * });
 */

export class StageChannelEndpoints {
  constructor(rest) {
    this.rest = rest;
  }

  /**
   * Gets the stage instance for a stage channel.
   * 
   * @param {string} channelId - The stage channel ID
   * @returns {Promise<Object>} The stage instance object
   * 
   * @example
   * const instance = await stageChannels.getStageInstance('123456789');
   * console.log(`Topic: ${instance.topic}`);
   */
  async getStageInstance(channelId) {
    return this.rest.get(`/channels/${channelId}/stage-instances`);
  }

  /**
   * Creates a stage instance in a stage channel.
   * Requires MUTE_MEMBERS permission.
   * 
   * @param {string} channelId - The stage channel ID
   * @param {Object} data - Stage instance data
   * @param {string} [data.topic] - The stage topic (1-120 characters)
   * @param {number} [data.privacy_level] - Privacy level (1=public, 2=guild only)
   * @returns {Promise<Object>} The created stage instance object
   * 
   * @example
   * const instance = await stageChannels.createStageInstance('123456789', {
   *   topic: 'Community Town Hall',
   *   privacy_level: 2
   * });
   */
  async createStageInstance(channelId, data = {}) {
    return this.rest.post(`/channels/${channelId}/stage-instances`, { body: data });
  }

  /**
   * Modifies a stage instance.
   * Requires MUTE_MEMBERS permission.
   * 
   * @param {string} channelId - The stage channel ID
   * @param {Object} data - Stage instance modification data
   * @param {string} [data.topic] - The new stage topic
   * @param {number} [data.privacy_level] - The new privacy level
   * @returns {Promise<Object>} The modified stage instance object
   * 
   * @example
   * const instance = await stageChannels.modifyStageInstance('123456789', {
   *   topic: 'Updated topic'
   * });
   */
  async modifyStageInstance(channelId, data) {
    return this.rest.patch(`/channels/${channelId}/stage-instances`, { body: data });
  }

  /**
   * Deletes a stage instance.
   * Requires MUTE_MEMBERS permission.
   * 
   * @param {string} channelId - The stage channel ID
   * @returns {Promise<Object>} Empty object on success
   * 
   * @example
   * await stageChannels.deleteStageInstance('123456789');
   */
  async deleteStageInstance(channelId) {
    return this.rest.delete(`/channels/${channelId}/stage-instances`);
  }
}
