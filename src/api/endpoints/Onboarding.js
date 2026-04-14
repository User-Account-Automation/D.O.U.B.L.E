/**
 * Guild Onboarding Endpoints
 * 
 * Provides methods for managing guild onboarding flows.
 * Onboarding helps new members get oriented with the guild.
 * 
 * @example
 * import { Client } from 'double';
 * const client = new Client({ token });
 * await client.connect();
 * 
 * // Get onboarding settings
 * const onboarding = await client.onboarding.getOnboarding('guild_id');
 * 
 * // Update onboarding flow
 * const updated = await client.onboarding.modifyOnboarding('guild_id', {
 *   default_channel_id: 'channel_id'
 * });
 */

export class OnboardingEndpoints {
  constructor(rest) {
    this.rest = rest;
  }

  /**
   * Gets the onboarding settings for a guild.
   * Requires MANAGE_GUILD permission.
   * 
   * @param {string} guildId - The guild ID
   * @returns {Promise<Object>} The onboarding object
   * 
   * @example
   * const onboarding = await onboarding.getOnboarding('123456789');
   * console.log(`Default channel: ${onboarding.default_channel_id}`);
   */
  async getOnboarding(guildId) {
    return this.rest.get(`/guilds/${guildId}/onboarding`);
  }

  /**
   * Modifies the onboarding settings for a guild.
   * Requires MANAGE_GUILD permission.
   * 
   * @param {string} guildId - The guild ID
   * @param {Object} data - Onboarding modification data
   * @param {Array<Object>} [data.prompts] - Array of onboarding prompts
   * @param {string} [data.default_channel_id] - Default channel for new members
   * @param {boolean} [data.enabled] - Whether onboarding is enabled
   * @param {string} [data.mode] - Onboarding mode (0=default, 1=advanced)
   * @returns {Promise<Object>} The modified onboarding object
   * 
   * @example
   * const onboarding = await onboarding.modifyOnboarding('123456789', {
   *   enabled: true,
   *   default_channel_id: 'welcome_channel_id',
   *   prompts: [
   *     {
   *       type: 0,
   *       title: 'What brings you here?',
   *       options: [
   *         { title: 'Gaming' },
   *         { title: 'Chatting' }
   *       ]
   *     }
   *   ]
   * });
   */
  async modifyOnboarding(guildId, data) {
    return this.rest.put(`/guilds/${guildId}/onboarding`, { body: data });
  }
}
