/**
 * Invite Endpoints
 * 
 * Provides methods for managing Discord invites.
 * Invites allow users to join guilds and can be managed with various restrictions.
 * 
 * @example
 * import { Client } from 'double';
 * const client = new Client({ token });
 * await client.connect();
 * 
 * // Get invites for a channel
 * const invites = await client.invites.getChannelInvites('channel_id');
 * 
 * // Create a new invite
 * const invite = await client.invites.createInvite('channel_id', {
 *   max_age: 86400,
 *   max_uses: 10
 * });
 */

export class InviteEndpoints {
  constructor(rest) {
    this.rest = rest;
  }

  /**
   * Gets invites for a specific channel.
   * Requires MANAGE_CHANNELS permission.
   * 
   * @param {string} channelId - The channel ID
   * @returns {Promise<Array>} Array of invite objects
   * 
   * @example
   * const invites = await invites.getChannelInvites('123456789');
   * invites.forEach(invite => {
   *   console.log(`${invite.code}: ${invite.uses}/${invite.max_uses} uses`);
   * });
   */
  async getChannelInvites(channelId) {
    return this.rest.get(`/channels/${channelId}/invites`);
  }

  /**
   * Gets invites for a guild.
   * Requires MANAGE_GUILD permission.
   * 
   * @param {string} guildId - The guild ID
   * @returns {Promise<Array>} Array of invite objects
   * 
   * @example
   * const invites = await invites.getGuildInvites('123456789');
   */
  async getGuildInvites(guildId) {
    return this.rest.get(`/guilds/${guildId}/invites`);
  }

  /**
   * Gets a specific invite by code.
   * 
   * @param {string} inviteCode - The invite code
   * @param {Object} [options] - Optional parameters
   * @param {boolean} [options.with_counts] - Whether to include approximate member counts
   * @param {boolean} [options.with_expiration] - Whether to include expiration date
   * @param {string} [options.guild_scheduled_event_id] - Include scheduled event data
   * @returns {Promise<Object>} The invite object
   * 
   * @example
   * const invite = await invites.getInvite('abc123', { with_counts: true });
   * console.log(`Guild: ${invite.guild.name}`);
   * console.log(`Online: ${invite.approximate_presence_count}`);
   */
  async getInvite(inviteCode, options = {}) {
    const params = new URLSearchParams();
    if (options.with_counts) params.append('with_counts', 'true');
    if (options.with_expiration) params.append('with_expiration', 'true');
    if (options.guild_scheduled_event_id) params.append('guild_scheduled_event_id', options.guild_scheduled_event_id);
    
    return this.rest.get(`/invites/${inviteCode}?${params}`);
  }

  /**
   * Creates a new invite for a channel.
   * Requires CREATE_INSTANT_INVITE permission.
   * 
   * @param {string} channelId - The channel ID
   * @param {Object} [data] - Invite creation options
   * @param {number} [data.max_age] - Duration in seconds before expiration (0-604800, 0 for never)
   * @param {number} [data.max_uses] - Maximum number of uses (0 for unlimited)
   * @param {boolean} [data.temporary] - Whether membership is temporary
   * @param {boolean} [data.unique] - Whether the invite should be unique
   * @param {number} [data.target_type] - Target type (1=stream, 2=embedded application)
   * @param {string} [data.target_user_id] - User ID for stream invite
   * @param {string} [data.target_application_id] - Application ID for embedded invite
   * @returns {Promise<Object>} The created invite object
   * 
   * @example
   * const invite = await invites.createInvite('123456789', {
   *   max_age: 86400,
   *   max_uses: 100,
   *   temporary: false,
   *   unique: true
   * });
   * console.log(`Invite code: ${invite.code}`);
   */
  async createInvite(channelId, data = {}) {
    return this.rest.post(`/channels/${channelId}/invites`, { body: data });
  }

  /**
   * Deletes an invite.
   * Requires MANAGE_CHANNELS permission.
   * 
   * @param {string} inviteCode - The invite code
   * @returns {Promise<Object>} The deleted invite object
   * 
   * @example
   * await invites.deleteInvite('abc123');
   */
  async deleteInvite(inviteCode) {
    return this.rest.delete(`/invites/${inviteCode}`);
  }

  /**
   * Accepts an invite to join a guild.
   * This requires an OAuth2 access token, not a bot token.
   * 
   * @param {string} inviteCode - The invite code
   * @returns {Promise<Object>} The invite object with guild information
   * 
   * @example
   * const invite = await invites.acceptInvite('abc123');
   * console.log(`Joined guild: ${invite.guild.name}`);
   */
  async acceptInvite(inviteCode) {
    return this.rest.post(`/invites/${inviteCode}`, {});
  }

  /**
   * Gets all valid invite codes for a guild.
   * Useful for tracking active invites.
   * 
   * @param {string} guildId - The guild ID
   * @returns {Promise<Array>} Array of invite codes
   * 
   * @example
   * const codes = await invites.getGuildInviteCodes('123456789');
   * console.log(`Active invites: ${codes.length}`);
   */
  async getGuildInviteCodes(guildId) {
    const invites = await this.getGuildInvites(guildId);
    return invites.map(invite => invite.code);
  }

  /**
   * Gets invite usage statistics for a guild.
   * Calculates total uses, active invites, and expired invites.
   * 
   * @param {string} guildId - The guild ID
   * @returns {Promise<Object>} Statistics object
   * 
   * @example
   * const stats = await invites.getInviteStats('123456789');
   * console.log(`Total uses: ${stats.totalUses}`);
   * console.log(`Active invites: ${stats.activeInvites}`);
   */
  async getInviteStats(guildId) {
    const invites = await this.getGuildInvites(guildId);
    
    const stats = {
      totalInvites: invites.length,
      totalUses: invites.reduce((sum, invite) => sum + (invite.uses || 0), 0),
      activeInvites: invites.filter(invite => !invite.expires_at || new Date(invite.expires_at) > new Date()).length,
      expiredInvites: invites.filter(invite => invite.expires_at && new Date(invite.expires_at) <= new Date()).length,
      temporaryInvites: invites.filter(invite => invite.temporary).length,
      uniqueInvites: invites.filter(invite => invite.unique).length
    };
    
    return stats;
  }

  /**
   * Gets invites that are about to expire within a time window.
   * Useful for monitoring and renewing invites.
   * 
   * @param {string} guildId - The guild ID
   * @param {number} [hours=24] - Time window in hours
   * @returns {Promise<Array>} Array of invites expiring soon
   * 
   * @example
   * const expiring = await invites.getExpiringInvites('123456789', 48);
   * expiring.forEach(invite => {
   *   console.log(`Expires: ${invite.expires_at} - ${invite.code}`);
   * });
   */
  async getExpiringInvites(guildId, hours = 24) {
    const invites = await this.getGuildInvites(guildId);
    const cutoff = new Date(Date.now() + hours * 3600000);
    
    return invites.filter(invite => {
      if (!invite.expires_at) return false;
      const expiry = new Date(invite.expires_at);
      return expiry <= cutoff && expiry > new Date();
    });
  }

  /**
   * Gets invites that have exceeded their usage limit.
   * 
   * @param {string} guildId - The guild ID
   * @returns {Promise<Array>} Array of exhausted invites
   * 
   * @example
   * const exhausted = await invites.getExhaustedInvites('123456789');
   * console.log(`Exhausted invites: ${exhausted.length}`);
   */
  async getExhaustedInvites(guildId) {
    const invites = await this.getGuildInvites(guildId);
    
    return invites.filter(invite => {
      return invite.max_uses && invite.uses >= invite.max_uses;
    });
  }

  /**
   * Creates a temporary invite that expires after a short duration.
   * Useful for one-time access or temporary sharing.
   * 
   * @param {string} channelId - The channel ID
   * @param {number} [duration=3600] - Duration in seconds
   * @param {number} [uses=1] - Maximum uses
   * @returns {Promise<Object>} The created invite object
   * 
   * @example
   * const invite = await invites.createTemporaryInvite('123456789', 3600, 1);
   * console.log(`Temporary invite: ${invite.code}`);
   */
  async createTemporaryInvite(channelId, duration = 3600, uses = 1) {
    return this.createInvite(channelId, {
      max_age: duration,
      max_uses: uses,
      temporary: true,
      unique: true
    });
  }

  /**
   * Creates a permanent invite that never expires.
   * Useful for permanent community access.
   * 
   * @param {string} channelId - The channel ID
   * @returns {Promise<Object>} The created invite object
   * 
   * @example
   * const invite = await invites.createPermanentInvite('123456789');
   * console.log(`Permanent invite: ${invite.code}`);
   */
  async createPermanentInvite(channelId) {
    return this.createInvite(channelId, {
      max_age: 0,
      max_uses: 0,
      temporary: false,
      unique: true
    });
  }

  /**
   * Bulk creates multiple invites for a channel.
   * Useful for generating backup invites.
   * 
   * @param {string} channelId - The channel ID
   * @param {number} [count=5] - Number of invites to create
   * @param {Object} [options] - Invite options
   * @returns {Promise<Array>} Array of created invite objects
   * 
   * @example
   * const invites = await invites.bulkCreateInvites('123456789', 10, {
   *   max_age: 86400,
   *   max_uses: 50
   * });
   */
  async bulkCreateInvites(channelId, count = 5, options = {}) {
    const invites = [];
    
    for (let i = 0; i < count; i++) {
      const invite = await this.createInvite(channelId, { ...options, unique: true });
      invites.push(invite);
    }
    
    return invites;
  }

  /**
   * Validates an invite code without using it.
   * Checks if the invite is valid and not expired.
   * 
   * @param {string} inviteCode - The invite code
   * @returns {Promise<Object>} Validation result
   * 
   * @example
   * const validation = await invites.validateInvite('abc123');
   * console.log(`Valid: ${validation.valid}`);
   * console.log(`Guild: ${validation.guild?.name}`);
   */
  async validateInvite(inviteCode) {
    try {
      const invite = await this.getInvite(inviteCode, { with_counts: true });
      
      const validation = {
        valid: true,
        guild: invite.guild,
        channel: invite.channel,
        inviter: invite.inviter,
        expiresAt: invite.expires_at,
        uses: invite.uses,
        maxUses: invite.max_uses,
        approximateMemberCount: invite.approximate_member_count,
        approximatePresenceCount: invite.approximate_presence_count
      };
      
      // Check if expired
      if (invite.expires_at && new Date(invite.expires_at) <= new Date()) {
        validation.valid = false;
        validation.reason = 'Invite has expired';
      }
      
      // Check if exhausted
      if (invite.max_uses && invite.uses >= invite.max_uses) {
        validation.valid = false;
        validation.reason = 'Invite has reached maximum uses';
      }
      
      return validation;
    } catch (error) {
      return {
        valid: false,
        reason: error.message || 'Invalid invite code'
      };
    }
  }
}
