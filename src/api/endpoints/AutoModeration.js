/**
 * Auto Moderation Endpoints
 * 
 * Provides methods for managing Discord auto moderation rules.
 * Auto moderation automatically moderates messages based on rules.
 * 
 * @example
 * import { Client } from 'double';
 * const client = new Client({ token });
 * await client.connect();
 * 
 * // Get all auto moderation rules
 * const rules = await client.autoModeration.getRules('guild_id');
 * 
 * // Create a new rule
 * const rule = await client.autoModeration.createRule('guild_id', {
 *   name: 'No Spam',
 *   trigger_type: 1,
 *   event_type: 1
 * });
 */

export class AutoModerationEndpoints {
  constructor(rest) {
    this.rest = rest;
  }

  /**
   * Gets all auto moderation rules for a guild.
   * Requires MANAGE_GUILD permission.
   * 
   * @param {string} guildId - The guild ID
   * @returns {Promise<Array>} Array of auto moderation rule objects
   * 
   * @example
   * const rules = await autoModeration.getRules('123456789');
   * rules.forEach(rule => {
   *   console.log(`${rule.name}: ${rule.trigger_type}`);
   * });
   */
  async getRules(guildId) {
    return this.rest.get(`/guilds/${guildId}/auto-moderation/rules`);
  }

  /**
   * Gets a specific auto moderation rule.
   * Requires MANAGE_GUILD permission.
   * 
   * @param {string} guildId - The guild ID
   * @param {string} ruleId - The rule ID
   * @returns {Promise<Object>} The auto moderation rule object
   * 
   * @example
   * const rule = await autoModeration.getRule('123456789', 'rule_id');
   */
  async getRule(guildId, ruleId) {
    return this.rest.get(`/guilds/${guildId}/auto-moderation/rules/${ruleId}`);
  }

  /**
   * Creates a new auto moderation rule.
   * Requires MANAGE_GUILD permission.
   * 
   * @param {string} guildId - The guild ID
   * @param {Object} data - Rule data
   * @param {string} data.name - The rule name (1-100 characters)
   * @param {number} data.trigger_type - Trigger type (1=keyword, 2=spam, 3=keyword list, 4=mention spam, 5=member profile)
   * @param {number} data.event_type - Event type (1=message send)
   * @param {Array<Object>} data.trigger_metadata - Trigger configuration
   * @param {Array<Object>} [data.actions] - Actions to take when triggered
   * @param {boolean} [data.enabled] - Whether the rule is enabled
   * @param {Array<string>} [data.exempt_roles] - Role IDs exempt from this rule
   * @param {Array<string>} [data.exempt_channels] - Channel IDs exempt from this rule
   * @returns {Promise<Object>} The created rule object
   * 
   * @example
   * const rule = await autoModeration.createRule('123456789', {
   *   name: 'No Spam',
   *   trigger_type: 2,
   *   event_type: 1,
   *   trigger_metadata: {},
   *   actions: [
   *     {
   *       type: 1,
   *       metadata: { channel_id: 'channel_id', duration_seconds: 60 }
   *     }
   *   ],
   *   enabled: true
   * });
   */
  async createRule(guildId, data) {
    return this.rest.post(`/guilds/${guildId}/auto-moderation/rules`, { body: data });
  }

  /**
   * Modifies an auto moderation rule.
   * Requires MANAGE_GUILD permission.
   * 
   * @param {string} guildId - The guild ID
   * @param {string} ruleId - The rule ID
   * @param {Object} data - Rule modification data
   * @returns {Promise<Object>} The modified rule object
   * 
   * @example
   * const rule = await autoModeration.modifyRule('123456789', 'rule_id', {
   *   name: 'Updated Rule Name',
   *   enabled: false
   * });
   */
  async modifyRule(guildId, ruleId, data) {
    return this.rest.patch(`/guilds/${guildId}/auto-moderation/rules/${ruleId}`, { body: data });
  }

  /**
   * Deletes an auto moderation rule.
   * Requires MANAGE_GUILD permission.
   * 
   * @param {string} guildId - The guild ID
   * @param {string} ruleId - The rule ID
   * @returns {Promise<Object>} Empty object on success
   * 
   * @example
   * await autoModeration.deleteRule('123456789', 'rule_id');
   */
  async deleteRule(guildId, ruleId) {
    return this.rest.delete(`/guilds/${guildId}/auto-moderation/rules/${ruleId}`);
  }
}
