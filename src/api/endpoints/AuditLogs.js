/**
 * Audit Log Endpoints
 * 
 * Provides methods for accessing and querying Discord guild audit logs.
 * Audit logs track administrative actions taken in a guild, such as member bans,
 * role changes, channel modifications, and more.
 * 
 * This is critical for selfbot monitoring and tracking guild activities.
 * 
 * @example
 * import { Client } from 'double';
 * const client = new Client({ token });
 * await client.connect();
 * 
 * // Get audit logs for a guild
 * const logs = await client.auditLogs.getAuditLog('guild_id', {
 *   limit: 100,
 *   action_type: 20
 * });
 */

export class AuditLogEndpoints {
  constructor(rest) {
    this.rest = rest;
  }

  /**
   * Gets the audit log for a guild.
   * Requires VIEW_AUDIT_LOG permission.
   * 
   * @param {string} guildId - The guild ID
   * @param {Object} [options] - Optional query parameters
   * @param {string} [options.user_id] - Filter by user ID who performed the action
   * @param {number} [options.action_type] - Filter by action type (1-100)
   * @param {string} [options.before] - Get entries before this audit log entry ID
   * @param {string} [options.after] - Get entries after this audit log entry ID
   * @param {number} [options.limit] - Maximum number of entries to return (1-100)
   * @returns {Promise<Object>} The audit log object containing entries and users
   * 
   * @example
   * const auditLog = await auditLogs.getAuditLog('123456789', {
   *   limit: 50,
   *   action_type: 20
   * });
   * 
   * auditLog.audit_log_entries.forEach(entry => {
   *   console.log(`${entry.action_type}: ${entry.target_id}`);
   * });
   */
  async getAuditLog(guildId, options = {}) {
    const params = new URLSearchParams();
    
    if (options.user_id) params.append('user_id', options.user_id);
    if (options.action_type) params.append('action_type', options.action_type);
    if (options.before) params.append('before', options.before);
    if (options.after) params.append('after', options.after);
    if (options.limit) params.append('limit', options.limit);
    
    return this.rest.get(`/guilds/${guildId}/audit-logs?${params}`);
  }

  /**
   * Gets audit log entries filtered by a specific user.
   * Useful for tracking actions performed by a specific moderator or admin.
   * 
   * @param {string} guildId - The guild ID
   * @param {string} userId - The user ID to filter by
   * @param {Object} [options] - Additional query parameters
   * @returns {Promise<Object>} The audit log object filtered by user
   * 
   * @example
   * const logs = await auditLogs.getUserAuditLog('123456789', 'user_id', {
   *   limit: 100
   * });
   */
  async getUserAuditLog(guildId, userId, options = {}) {
    return this.getAuditLog(guildId, { ...options, user_id: userId });
  }

  /**
   * Gets audit log entries filtered by action type.
   * Common action types:
   * - 1: GUILD_UPDATE
   * - 10: CHANNEL_CREATE
   * - 11: CHANNEL_UPDATE
   * - 12: CHANNEL_DELETE
   * - 14: CHANNEL_OVERWRITE_CREATE
   * - 15: CHANNEL_OVERWRITE_UPDATE
   * - 16: CHANNEL_OVERWRITE_DELETE
   * - 20: MEMBER_KICK
   * - 21: MEMBER_PRUNE
   * - 22: MEMBER_BAN_ADD
   * - 23: MEMBER_BAN_REMOVE
   * - 24: MEMBER_UPDATE
   * - 25: MEMBER_ROLE_UPDATE
   * - 26: MEMBER_MOVE
   * - 27: MEMBER_DISCONNECT
   * - 28: BOT_ADD
   * - 30: ROLE_CREATE
   * - 31: ROLE_UPDATE
   * - 32: ROLE_DELETE
   * - 40: INVITE_CREATE
   * - 41: INVITE_UPDATE
   * - 42: INVITE_DELETE
   * - 50: WEBHOOK_CREATE
   * - 51: WEBHOOK_UPDATE
   * - 52: WEBHOOK_DELETE
   * - 60: EMOJI_CREATE
   * - 61: EMOJI_UPDATE
   * - 62: EMOJI_DELETE
   * - 72: MESSAGE_DELETE
   * - 73: MESSAGE_BULK_DELETE
   * - 74: MESSAGE_PIN
   * - 75: MESSAGE_UNPIN
   * - 80: INTEGRATION_CREATE
   * - 81: INTEGRATION_UPDATE
   * - 82: INTEGRATION_DELETE
   * 
   * @param {string} guildId - The guild ID
   * @param {number} actionType - The action type to filter by
   * @param {Object} [options] - Additional query parameters
   * @returns {Promise<Object>} The audit log object filtered by action type
   * 
   * @example
   * // Get all ban actions
   * const bans = await auditLogs.getActionTypeAuditLog('123456789', 22);
   * 
   * // Get all role updates
   * const roleUpdates = await auditLogs.getActionTypeAuditLog('123456789', 31);
   */
  async getActionTypeAuditLog(guildId, actionType, options = {}) {
    return this.getAuditLog(guildId, { ...options, action_type: actionType });
  }

  /**
   * Gets recent audit log entries (last 50).
   * Useful for monitoring recent guild activity.
   * 
   * @param {string} guildId - The guild ID
   * @returns {Promise<Object>} The audit log object with recent entries
   * 
   * @example
   * const recent = await auditLogs.getRecentAuditLog('123456789');
   * recent.audit_log_entries.slice(0, 10).forEach(entry => {
   *   console.log(`${new Date(entry.id / 4194304 + 1420070400000).toLocaleString()}: ${entry.action_type}`);
   * });
   */
  async getRecentAuditLog(guildId) {
    return this.getAuditLog(guildId, { limit: 50 });
  }

  /**
   * Gets audit log entries for member-related actions.
   * This includes kicks, bans, role updates, and member modifications.
   * 
   * @param {string} guildId - The guild ID
   * @param {Object} [options] - Additional query parameters
   * @returns {Promise<Object>} The audit log object with member actions
   * 
   * @example
   * const memberActions = await auditLogs.getMemberAuditLog('123456789');
   */
  async getMemberAuditLog(guildId, options = {}) {
    // Member-related action types: 20-28
    const memberActionTypes = [20, 21, 22, 23, 24, 25, 26, 27, 28];
    const logs = await this.getAuditLog(guildId, options);
    
    if (logs.audit_log_entries) {
      logs.audit_log_entries = logs.audit_log_entries.filter(
        entry => memberActionTypes.includes(entry.action_type)
      );
    }
    
    return logs;
  }

  /**
   * Gets audit log entries for channel-related actions.
   * This includes channel creation, updates, deletions, and permission changes.
   * 
   * @param {string} guildId - The guild ID
   * @param {Object} [options] - Additional query parameters
   * @returns {Promise<Object>} The audit log object with channel actions
   * 
   * @example
   * const channelActions = await auditLogs.getChannelAuditLog('123456789');
   */
  async getChannelAuditLog(guildId, options = {}) {
    // Channel-related action types: 10-16
    const channelActionTypes = [10, 11, 12, 14, 15, 16];
    const logs = await this.getAuditLog(guildId, options);
    
    if (logs.audit_log_entries) {
      logs.audit_log_entries = logs.audit_log_entries.filter(
        entry => channelActionTypes.includes(entry.action_type)
      );
    }
    
    return logs;
  }

  /**
   * Gets audit log entries for role-related actions.
   * This includes role creation, updates, and deletions.
   * 
   * @param {string} guildId - The guild ID
   * @param {Object} [options] - Additional query parameters
   * @returns {Promise<Object>} The audit log object with role actions
   * 
   * @example
   * const roleActions = await auditLogs.getRoleAuditLog('123456789');
   */
  async getRoleAuditLog(guildId, options = {}) {
    // Role-related action types: 30-32
    const roleActionTypes = [30, 31, 32];
    const logs = await this.getAuditLog(guildId, options);
    
    if (logs.audit_log_entries) {
      logs.audit_log_entries = logs.audit_log_entries.filter(
        entry => roleActionTypes.includes(entry.action_type)
      );
    }
    
    return logs;
  }

  /**
   * Gets audit log entries for message-related actions.
   * This includes message deletions, bulk deletions, and pin changes.
   * 
   * @param {string} guildId - The guild ID
   * @param {Object} [options] - Additional query parameters
   * @returns {Promise<Object>} The audit log object with message actions
   * 
   * @example
   * const messageActions = await auditLogs.getMessageAuditLog('123456789');
   */
  async getMessageAuditLog(guildId, options = {}) {
    // Message-related action types: 72-75
    const messageActionTypes = [72, 73, 74, 75];
    const logs = await this.getAuditLog(guildId, options);
    
    if (logs.audit_log_entries) {
      logs.audit_log_entries = logs.audit_log_entries.filter(
        entry => messageActionTypes.includes(entry.action_type)
      );
    }
    
    return logs;
  }

  /**
   * Gets audit log entries for invite-related actions.
   * This includes invite creation, updates, and deletions.
   * 
   * @param {string} guildId - The guild ID
   * @param {Object} [options] - Additional query parameters
   * @returns {Promise<Object>} The audit log object with invite actions
   * 
   * @example
   * const inviteActions = await auditLogs.getInviteAuditLog('123456789');
   */
  async getInviteAuditLog(guildId, options = {}) {
    // Invite-related action types: 40-42
    const inviteActionTypes = [40, 41, 42];
    const logs = await this.getAuditLog(guildId, options);
    
    if (logs.audit_log_entries) {
      logs.audit_log_entries = logs.audit_log_entries.filter(
        entry => inviteActionTypes.includes(entry.action_type)
      );
    }
    
    return logs;
  }

  /**
   * Gets audit log entries for webhook-related actions.
   * This includes webhook creation, updates, and deletions.
   * 
   * @param {string} guildId - The guild ID
   * @param {Object} [options] - Additional query parameters
   * @returns {Promise<Object>} The audit log object with webhook actions
   * 
   * @example
   * const webhookActions = await auditLogs.getWebhookAuditLog('123456789');
   */
  async getWebhookAuditLog(guildId, options = {}) {
    // Webhook-related action types: 50-52
    const webhookActionTypes = [50, 51, 52];
    const logs = await this.getAuditLog(guildId, options);
    
    if (logs.audit_log_entries) {
      logs.audit_log_entries = logs.audit_log_entries.filter(
        entry => webhookActionTypes.includes(entry.action_type)
      );
    }
    
    return logs;
  }

  /**
   * Gets audit log entries for emoji-related actions.
   * This includes emoji creation, updates, and deletions.
   * 
   * @param {string} guildId - The guild ID
   * @param {Object} [options] - Additional query parameters
   * @returns {Promise<Object>} The audit log object with emoji actions
   * 
   * @example
   * const emojiActions = await auditLogs.getEmojiAuditLog('123456789');
   */
  async getEmojiAuditLog(guildId, options = {}) {
    // Emoji-related action types: 60-62
    const emojiActionTypes = [60, 61, 62];
    const logs = await this.getAuditLog(guildId, options);
    
    if (logs.audit_log_entries) {
      logs.audit_log_entries = logs.audit_log_entries.filter(
        entry => emojiActionTypes.includes(entry.action_type)
      );
    }
    
    return logs;
  }

  /**
   * Gets audit log entries for integration-related actions.
   * This includes integration creation, updates, and deletions.
   * 
   * @param {string} guildId - The guild ID
   * @param {Object} [options] - Additional query parameters
   * @returns {Promise<Object>} The audit log object with integration actions
   * 
   * @example
   * const integrationActions = await auditLogs.getIntegrationAuditLog('123456789');
   */
  async getIntegrationAuditLog(guildId, options = {}) {
    // Integration-related action types: 80-82
    const integrationActionTypes = [80, 81, 82];
    const logs = await this.getAuditLog(guildId, options);
    
    if (logs.audit_log_entries) {
      logs.audit_log_entries = logs.audit_log_entries.filter(
        entry => integrationActionTypes.includes(entry.action_type)
      );
    }
    
    return logs;
  }

  /**
   * Gets audit log entries within a specific time range.
   * Useful for analyzing activity during a specific period.
   * 
   * @param {string} guildId - The guild ID
   * @param {Date} startDate - The start date
   * @param {Date} endDate - The end date
   * @param {Object} [options] - Additional query parameters
   * @returns {Promise<Object>} The audit log object with entries in the time range
   * 
   * @example
   * const start = new Date('2024-01-01');
   * const end = new Date('2024-01-31');
   * const logs = await auditLogs.getAuditLogByDateRange('123456789', start, end);
   */
  async getAuditLogByDateRange(guildId, startDate, endDate, options = {}) {
    const logs = await this.getAuditLog(guildId, options);
    
    if (logs.audit_log_entries) {
      const startTime = startDate.getTime();
      const endTime = endDate.getTime();
      
      logs.audit_log_entries = logs.audit_log_entries.filter(entry => {
        const entryTime = parseInt(entry.id) / 4194304 + 1420070400000;
        return entryTime >= startTime && entryTime <= endTime;
      });
    }
    
    return logs;
  }

  /**
   * Gets audit log entries that match specific criteria.
   * Provides a flexible way to filter audit logs by multiple conditions.
   * 
   * @param {string} guildId - The guild ID
   * @param {Object} criteria - Filter criteria
   * @param {string} [criteria.user_id] - Filter by user ID
   * @param {number} [criteria.action_type] - Filter by action type
   * @param {string} [criteria.target_id] - Filter by target ID
   * @param {Date} [criteria.after_date] - Filter entries after this date
   * @param {Date} [criteria.before_date] - Filter entries before this date
   * @param {Object} [options] - Additional query parameters
   * @returns {Promise<Object>} The filtered audit log object
   * 
   * @example
   * const logs = await auditLogs.getFilteredAuditLog('123456789', {
   *   user_id: 'user_id',
   *   action_type: 22,
   *   target_id: 'target_id'
   * });
   */
  async getFilteredAuditLog(guildId, criteria, options = {}) {
    const logs = await this.getAuditLog(guildId, options);
    
    if (logs.audit_log_entries) {
      logs.audit_log_entries = logs.audit_log_entries.filter(entry => {
        if (criteria.user_id && entry.user_id !== criteria.user_id) return false;
        if (criteria.action_type && entry.action_type !== criteria.action_type) return false;
        if (criteria.target_id && entry.target_id !== criteria.target_id) return false;
        
        if (criteria.after_date || criteria.before_date) {
          const entryTime = parseInt(entry.id) / 4194304 + 1420070400000;
          if (criteria.after_date && entryTime < criteria.after_date.getTime()) return false;
          if (criteria.before_date && entryTime > criteria.before_date.getTime()) return false;
        }
        
        return true;
      });
    }
    
    return logs;
  }
}
