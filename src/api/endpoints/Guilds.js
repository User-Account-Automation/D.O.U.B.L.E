/**
 * Guild Endpoints
 * 
 * Provides methods for managing Discord guilds (servers).
 * This includes guild information, channels, roles, members, and other guild-specific operations.
 * 
 * @example
 * import { Client } from 'double';
 * const client = new Client({ token });
 * await client.connect();
 * 
 * // Get guild information
 * const guild = await client.guilds.getGuild('guild_id');
 * 
 * // Create a new channel
 * const channel = await client.guilds.createChannel('guild_id', {
 *   name: 'general',
 *   type: 0
 * });
 */

export class GuildEndpoints {
  constructor(rest) {
    this.rest = rest;
  }

  /**
   * Gets a guild by ID.
   * 
   * @param {string} guildId - The guild ID
   * @param {Object} [options] - Optional parameters
   * @param {boolean} [options.with_counts] - Whether to include approximate member and presence counts
   * @returns {Promise<Object>} The guild object
   * 
   * @example
   * const guild = await guilds.getGuild('123456789', { with_counts: true });
   */
  async getGuild(guildId, options = {}) {
    const params = new URLSearchParams();
    if (options.with_counts) params.append('with_counts', 'true');
    
    return this.rest.get(`/guilds/${guildId}?${params}`);
  }

  /**
   * Modifies a guild's settings.
   * Requires MANAGE_GUILD permission.
   * 
   * @param {string} guildId - The guild ID
   * @param {Object} data - Guild modification data
   * @param {string} [data.name] - The new guild name (2-100 characters)
   * @param {string} [data.description] - The guild description (0-1024 characters)
   * @param {string} [data.icon] - Base64 encoded icon
   * @param {string} [data.splash] - Base64 encoded splash image
   * @param {string} [data.discovery_splash] - Base64 encoded discovery splash
   * @param {string} [data.banner] - Base64 encoded banner image
   * @param {string} [data.owner_id] - User ID to transfer ownership to
   * @param {string} [data.afk_channel_id] - Voice channel ID for AFK
   * @param {number} [data.afk_timeout] - AFK timeout in seconds
   * @param {number} [data.default_message_notifications] - Default notification level
   * @param {string} [data.system_channel_id] - Channel ID for system messages
   * @param {number} [data.system_channel_flags] - System channel flags
   * @param {string} [data.rules_channel_id] - Channel ID for rules
   * @param {string} [data.public_updates_channel_id] - Channel ID for updates
   * @param {string} [data.preferred_locale] - Preferred locale
   * @param {number} [data.explicit_content_filter] - Explicit content filter level
   * @returns {Promise<Object>} The modified guild object
   * 
   * @example
   * const guild = await guilds.modifyGuild('123456789', {
   *   name: 'New Server Name',
   *   description: 'A cool server'
   * });
   */
  async modifyGuild(guildId, data) {
    return this.rest.patch(`/guilds/${guildId}`, { body: data });
  }

  /**
   * Deletes a guild.
   * Requires owner permissions.
   * 
   * @param {string} guildId - The guild ID
   * @returns {Promise<Object>} Empty object on success
   * 
   * @example
   * await guilds.deleteGuild('123456789');
   */
  async deleteGuild(guildId) {
    return this.rest.delete(`/guilds/${guildId}`);
  }

  /**
   * Gets all channels in a guild.
   * 
   * @param {string} guildId - The guild ID
   * @returns {Promise<Array>} Array of channel objects
   * 
   * @example
   * const channels = await guilds.getChannels('123456789');
   */
  async getChannels(guildId) {
    return this.rest.get(`/guilds/${guildId}/channels`);
  }

  /**
   * Creates a new channel in a guild.
   * Requires MANAGE_CHANNELS permission.
   * 
   * @param {string} guildId - The guild ID
   * @param {Object} data - Channel creation data
   * @param {string} data.name - The channel name (1-100 characters)
   * @param {number} data.type - The channel type (0=text, 2=voice, 4=category, 5=news, 13=stage)
   * @param {string} [data.topic] - The channel topic (0-1024 characters)
   * @param {number} [data.bitrate] - Voice channel bitrate (8000-96000)
   * @param {number} [data.user_limit] - Voice channel user limit (0-99)
   * @param {number} [data.rate_limit_per_user] - Slowmode duration in seconds (0-21600)
   * @param {number} [data.position] - Sorting position
   * @param {Object} [data.permission_overwrites] - Permission overwrites
   * @param {string} [data.parent_id] - Parent category ID
   * @param {boolean} [data.nsfw] - Whether the channel is NSFW
   * @returns {Promise<Object>} The created channel object
   * 
   * @example
   * const channel = await guilds.createChannel('123456789', {
   *   name: 'general',
   *   type: 0,
   *   topic: 'General discussion'
   * });
   */
  async createChannel(guildId, data) {
    return this.rest.post(`/guilds/${guildId}/channels`, { body: data });
  }

  /**
   * Modifies the positions of channels in a guild.
   * Requires MANAGE_CHANNELS permission.
   * 
   * @param {string} guildId - The guild ID
   * @param {Array<Object>} positions - Array of position objects
   * @param {string} positions[].id - The channel ID
   * @param {number} [positions[].position] - The new position
   * @param {boolean} [positions[].lock_permissions] - Whether to sync permissions
   * @param {string} [positions[].parent_id] - New parent category ID
   * @returns {Promise<Array>} Array of channel objects
   * 
   * @example
   * await guilds.modifyChannelPositions('123456789', [
   *   { id: 'channel1', position: 0 },
   *   { id: 'channel2', position: 1 }
   * ]);
   */
  async modifyChannelPositions(guildId, positions) {
    return this.rest.patch(`/guilds/${guildId}/channels`, { body: positions });
  }

  /**
   * Gets all roles in a guild.
   * 
   * @param {string} guildId - The guild ID
   * @returns {Promise<Array>} Array of role objects
   * 
   * @example
   * const roles = await guilds.getRoles('123456789');
   */
  async getRoles(guildId) {
    return this.rest.get(`/guilds/${guildId}/roles`);
  }

  /**
   * Creates a new role in a guild.
   * Requires MANAGE_ROLES permission.
   * 
   * @param {string} guildId - The guild ID
   * @param {Object} data - Role creation data
   * @param {string} [data.name] - The role name (1-100 characters)
   * @param {number} [data.permissions] - Permission bit flags
   * @param {number} [data.color] - RGB color value (0-16777215)
   * @param {boolean} [data.hoist] - Whether to display separately in member list
   * @param {boolean} [data.mentionable] - Whether the role can be mentioned
   * @param {string} [data.icon] - Base64 encoded icon for the role
   * @param {string} [data.unicode_emoji] - Unicode emoji for the role
   * @returns {Promise<Object>} The created role object
   * 
   * @example
   * const role = await guilds.createRole('123456789', {
   *   name: 'Moderator',
   *   permissions: 8,
   *   color: 0xff0000,
   *   hoist: true
   * });
   */
  async createRole(guildId, data) {
    return this.rest.post(`/guilds/${guildId}/roles`, { body: data });
  }

  /**
   * Modifies the positions of roles in a guild.
   * Requires MANAGE_ROLES permission.
   * 
   * @param {string} guildId - The guild ID
   * @param {Array<Object>} positions - Array of position objects
   * @param {string} positions[].id - The role ID
   * @param {number} positions[].position - The new position
   * @returns {Promise<Array>} Array of role objects
   * 
   * @example
   * await guilds.modifyRolePositions('123456789', [
   *   { id: 'role1', position: 0 },
   *   { id: 'role2', position: 1 }
   * ]);
   */
  async modifyRolePositions(guildId, positions) {
    return this.rest.patch(`/guilds/${guildId}/roles`, { body: positions });
  }

  /**
   * Modifies a guild role.
   * Requires MANAGE_ROLES permission.
   * 
   * @param {string} guildId - The guild ID
   * @param {string} roleId - The role ID
   * @param {Object} data - Role modification data
   * @returns {Promise<Object>} The modified role object
   * 
   * @example
   * const role = await guilds.modifyRole('123456789', 'role_id', {
   *   name: 'New Role Name',
   *   color: 0x00ff00
   * });
   */
  async modifyRole(guildId, roleId, data) {
    return this.rest.patch(`/guilds/${guildId}/roles/${roleId}`, { body: data });
  }

  /**
   * Deletes a guild role.
   * Requires MANAGE_ROLES permission.
   * 
   * @param {string} guildId - The guild ID
   * @param {string} roleId - The role ID
   * @returns {Promise<Object>} Empty object on success
   * 
   * @example
   * await guilds.deleteRole('123456789', 'role_id');
   */
  async deleteRole(guildId, roleId) {
    return this.rest.delete(`/guilds/${guildId}/roles/${roleId}`);
  }

  /**
   * Gets all bans in a guild.
   * Requires BAN_MEMBERS permission.
   * 
   * @param {string} guildId - The guild ID
   * @param {Object} [options] - Optional parameters
   * @param {number} [options.limit] - Number of bans to return (1-1000)
   * @param {string} [options.before] - Return bans before this user ID
   * @param {string} [options.after] - Return bans after this user ID
   * @returns {Promise<Array>} Array of ban objects
   * 
   * @example
   * const bans = await guilds.getBans('123456789', { limit: 100 });
   */
  async getBans(guildId, options = {}) {
    const params = new URLSearchParams();
    if (options.limit) params.append('limit', options.limit);
    if (options.before) params.append('before', options.before);
    if (options.after) params.append('after', options.after);
    
    return this.rest.get(`/guilds/${guildId}/bans?${params}`);
  }

  /**
   * Gets a specific ban in a guild.
   * Requires BAN_MEMBERS permission.
   * 
   * @param {string} guildId - The guild ID
   * @param {string} userId - The user ID
   * @returns {Promise<Object>} The ban object
   * 
   * @example
   * const ban = await guilds.getBan('123456789', 'user_id');
   */
  async getBan(guildId, userId) {
    return this.rest.get(`/guilds/${guildId}/bans/${userId}`);
  }

  /**
   * Creates a guild ban.
   * Requires BAN_MEMBERS permission.
   * 
   * @param {string} guildId - The guild ID
   * @param {string} userId - The user ID
   * @param {Object} [data] - Ban options
   * @param {number} [data.delete_message_seconds] - Seconds to delete messages (0-604800)
   * @param {string} [data.reason] - The reason for the ban (0-512 characters)
   * @returns {Promise<Object>} Empty object on success
   * 
   * @example
   * await guilds.createBan('123456789', 'user_id', {
   *   delete_message_seconds: 86400,
   *   reason: 'Violation of rules'
   * });
   */
  async createBan(guildId, userId, data = {}) {
    return this.rest.put(`/guilds/${guildId}/bans/${userId}`, { body: data });
  }

  /**
   * Removes a guild ban.
   * Requires BAN_MEMBERS permission.
   * 
   * @param {string} guildId - The guild ID
   * @param {string} userId - The user ID
   * @param {string} [reason] - The reason for removing the ban
   * @returns {Promise<Object>} Empty object on success
   * 
   * @example
   * await guilds.removeBan('123456789', 'user_id', 'Appeal accepted');
   */
  async removeBan(guildId, userId, reason) {
    const headers = {};
    if (reason) headers['X-Audit-Log-Reason'] = reason;
    
    return this.rest.delete(`/guilds/${guildId}/bans/${userId}`, { headers });
  }

  /**
   * Gets all members in a guild.
   * Requires GUILD_MEMBERS intent.
   * 
   * @param {string} guildId - The guild ID
   * @param {Object} [options] - Optional parameters
   * @param {number} [options.limit] - Number of members to return (1-1000)
   * @param {string} [options.after] - Return members after this user ID
   * @returns {Promise<Array>} Array of member objects
   * 
   * @example
   * const members = await guilds.getMembers('123456789', { limit: 100 });
   */
  async getMembers(guildId, options = {}) {
    const params = new URLSearchParams();
    if (options.limit) params.append('limit', options.limit);
    if (options.after) params.append('after', options.after);
    
    return this.rest.get(`/guilds/${guildId}/members?${params}`);
  }

  /**
   * Gets a specific guild member.
   * 
   * @param {string} guildId - The guild ID
   * @param {string} userId - The user ID
   * @returns {Promise<Object>} The member object
   * 
   * @example
   * const member = await guilds.getMember('123456789', 'user_id');
   */
  async getMember(guildId, userId) {
    return this.rest.get(`/guilds/${guildId}/members/${userId}`);
  }

  /**
   * Modifies a guild member.
   * Requires appropriate permissions based on modifications.
   * 
   * @param {string} guildId - The guild ID
   * @param {string} userId - The user ID
   * @param {Object} data - Member modification data
   * @param {string} [data.nick] - The new nickname (0-32 characters)
   * @param {Array<string>} [data.roles] - Array of role IDs
   * @param {boolean} [data.mute] - Whether to mute the user
   * @param {boolean} [data.deaf] - Whether to deafen the user
   * @param {string} [data.channel_id] - Voice channel ID to move user to
   * @param {number} [data.communication_disabled_until] - Timestamp until timeout ends
   * @param {string} [data.reason] - Audit log reason
   * @returns {Promise<Object>} The modified member object
   * 
   * @example
   * const member = await guilds.modifyMember('123456789', 'user_id', {
   *   nick: 'New Nickname',
   *   roles: ['role1', 'role2']
   * });
   */
  async modifyMember(guildId, userId, data) {
    const headers = {};
    if (data.reason) {
      headers['X-Audit-Log-Reason'] = data.reason;
      delete data.reason;
    }
    
    return this.rest.patch(`/guilds/${guildId}/members/${userId}`, { body: data, headers });
  }

  /**
   * Modifies the current user's member in a guild.
   * 
   * @param {string} guildId - The guild ID
   * @param {Object} data - Member modification data
   * @param {string} [data.nick] - The new nickname (0-32 characters)
   * @returns {Promise<Object>} The modified member object
   * 
   * @example
   * const member = await guilds.modifyCurrentMember('123456789', {
   *   nick: 'My Nickname'
   * });
   */
  async modifyCurrentMember(guildId, data) {
    return this.rest.patch(`/guilds/${guildId}/members/@me`, { body: data });
  }

  /**
   * Adds a user to a guild using an invite or OAuth2 access token.
   * 
   * @param {string} guildId - The guild ID
   * @param {Object} data - Join data
   * @param {string} [data.access_token] - OAuth2 access token
   * @param {string} [data.nick] - The nickname to assign
   * @param {Array<string>} [data.roles] - Array of role IDs
   * @param {boolean} [data.mute] - Whether to mute the user
   * @param {boolean} [data.deaf] - Whether to deafen the user
   * @returns {Promise<Object>} The member object
   * 
   * @example
   * const member = await guilds.addMember('123456789', {
   *   access_token: 'token',
   *   nick: 'New Member'
   * });
   */
  async addMember(guildId, data) {
    return this.rest.put(`/guilds/${guildId}/members/${data.userId}`, { body: data });
  }

  /**
   * Removes a member from a guild.
   * Requires KICK_MEMBERS permission.
   * 
   * @param {string} guildId - The guild ID
   * @param {string} userId - The user ID
   * @param {string} [reason] - The reason for the kick
   * @returns {Promise<Object>} Empty object on success
   * 
   * @example
   * await guilds.removeMember('123456789', 'user_id', 'Rule violation');
   */
  async removeMember(guildId, userId, reason) {
    const headers = {};
    if (reason) headers['X-Audit-Log-Reason'] = reason;
    
    return this.rest.delete(`/guilds/${guildId}/members/${userId}`, { headers });
  }

  /**
   * Gets the number of members that would be pruned.
   * Requires KICK_MEMBERS permission.
   * 
   * @param {string} guildId - The guild ID
   * @param {Object} [options] - Prune options
   * @param {number} [options.days] - Number of days of inactivity (1-30)
   * @param {Array<string>} [options.include_roles] - Array of role IDs to include
   * @returns {Promise<Object>} Object with pruned count
   * 
   * @example
   * const result = await guilds.getPruneCount('123456789', { days: 30 });
   * console.log(result.pruned);
   */
  async getPruneCount(guildId, options = {}) {
    const params = new URLSearchParams();
    if (options.days) params.append('days', options.days);
    if (options.include_roles) {
      options.include_roles.forEach(role => params.append('include_roles', role));
    }
    
    return this.rest.get(`/guilds/${guildId}/prune?${params}`);
  }

  /**
   * Begins a prune operation.
   * Requires KICK_MEMBERS permission.
   * 
   * @param {string} guildId - The guild ID
   * @param {Object} options - Prune options
   * @param {number} options.days - Number of days of inactivity (1-30)
   * @param {boolean} [options.compute_prune_count] - Whether to return prune count
   * @param {Array<string>} [options.include_roles] - Array of role IDs to include
   * @param {string} [options.reason] - Audit log reason
   * @returns {Promise<Object>} Object with pruned count if requested
   * 
   * @example
   * const result = await guilds.beginPrune('123456789', {
   *   days: 30,
   *   compute_prune_count: true,
   *   reason: 'Inactive members'
   * });
   */
  async beginPrune(guildId, options) {
    const headers = {};
    if (options.reason) {
      headers['X-Audit-Log-Reason'] = options.reason;
      delete options.reason;
    }
    
    return this.rest.post(`/guilds/${guildId}/prune`, { body: options, headers });
  }

  /**
   * Gets voice regions for a guild.
   * 
   * @param {string} guildId - The guild ID
   * @returns {Promise<Array>} Array of voice region objects
   * 
   * @example
   * const regions = await guilds.getVoiceRegions('123456789');
   */
  async getVoiceRegions(guildId) {
    return this.rest.get(`/guilds/${guildId}/regions`);
  }

  /**
   * Gets invites for a guild.
   * Requires MANAGE_GUILD permission.
   * 
   * @param {string} guildId - The guild ID
   * @returns {Promise<Array>} Array of invite objects
   * 
   * @example
   * const invites = await guilds.getInvites('123456789');
   */
  async getInvites(guildId) {
    return this.rest.get(`/guilds/${guildId}/invites`);
  }

  /**
   * Gets integrations for a guild.
   * Requires MANAGE_GUILD permission.
   * 
   * @param {string} guildId - The guild ID
   * @returns {Promise<Array>} Array of integration objects
   * 
   * @example
   * const integrations = await guilds.getIntegrations('123456789');
   */
  async getIntegrations(guildId) {
    return this.rest.get(`/guilds/${guildId}/integrations`);
  }

  /**
   * Gets the widget settings for a guild.
   * Requires MANAGE_GUILD permission.
   * 
   * @param {string} guildId - The guild ID
   * @returns {Promise<Object>} The widget settings object
   * 
   * @example
   * const settings = await guilds.getWidgetSettings('123456789');
   */
  async getWidgetSettings(guildId) {
    return this.rest.get(`/guilds/${guildId}/widget/settings`);
  }

  /**
   * Modifies the widget settings for a guild.
   * Requires MANAGE_GUILD permission.
   * 
   * @param {string} guildId - The guild ID
   * @param {Object} data - Widget settings
   * @param {boolean} [data.enabled] - Whether the widget is enabled
   * @param {string} [data.channel_id] - Channel ID for the widget
   * @returns {Promise<Object>} The modified widget settings
   * 
   * @example
   * const settings = await guilds.modifyWidgetSettings('123456789', {
   *   enabled: true,
   *   channel_id: 'channel_id'
   * });
   */
  async modifyWidgetSettings(guildId, data) {
    return this.rest.patch(`/guilds/${guildId}/widget/settings`, { body: data });
  }

  /**
   * Gets the widget for a guild.
   * 
   * @param {string} guildId - The guild ID
   * @returns {Promise<Object>} The widget object
   * 
   * @example
   * const widget = await guilds.getWidget('123456789');
   */
  async getWidget(guildId) {
    return this.rest.get(`/guilds/${guildId}/widget.json`);
  }

  /**
   * Gets the vanity URL for a guild.
   * Requires MANAGE_GUILD permission.
   * 
   * @param {string} guildId - The guild ID
   * @returns {Promise<Object>} Object with code and uses
   * 
   * @example
   * const vanity = await guilds.getVanityURL('123456789');
   * console.log(vanity.code);
   */
  async getVanityURL(guildId) {
    return this.rest.get(`/guilds/${guildId}/vanity-url`);
  }

  /**
   * Gets the welcome screen for a guild.
   * 
   * @param {string} guildId - The guild ID
   * @returns {Promise<Object>} The welcome screen object
   * 
   * @example
   * const welcome = await guilds.getWelcomeScreen('123456789');
   */
  async getWelcomeScreen(guildId) {
    return this.rest.get(`/guilds/${guildId}/welcome-screen`);
  }

  /**
   * Modifies the welcome screen for a guild.
   * Requires MANAGE_GUILD permission.
   * 
   * @param {string} guildId - The guild ID
   * @param {Object} data - Welcome screen data
   * @param {boolean} [data.enabled] - Whether the welcome screen is enabled
   * @param {Array<Object>} [data.welcome_channels] - Array of welcome channel objects
   * @param {string} [data.description] - The server description
   * @returns {Promise<Object>} The modified welcome screen
   * 
   * @example
   * const welcome = await guilds.modifyWelcomeScreen('123456789', {
   *   enabled: true,
   *   description: 'Welcome to our server!'
   * });
   */
  async modifyWelcomeScreen(guildId, data) {
    return this.rest.patch(`/guilds/${guildId}/welcome-screen`, { body: data });
  }

  /**
   * Gets scheduled events for a guild.
   * 
   * @param {string} guildId - The guild ID
   * @param {Object} [options] - Optional parameters
   * @param {boolean} [options.with_user_count] - Whether to include user count
   * @returns {Promise<Array>} Array of scheduled event objects
   * 
   * @example
   * const events = await guilds.getScheduledEvents('123456789');
   */
  async getScheduledEvents(guildId, options = {}) {
    const params = new URLSearchParams();
    if (options.with_user_count) params.append('with_user_count', 'true');
    
    return this.rest.get(`/guilds/${guildId}/scheduled-events?${params}`);
  }

  /**
   * Creates a scheduled event.
   * Requires MANAGE_EVENTS permission.
   * 
   * @param {string} guildId - The guild ID
   * @param {Object} data - Event data
   * @param {string} data.name - The event name (1-100 characters)
   * @param {string} data.description - The event description (1-1000 characters)
   * @param {number} data.scheduled_start_time - ISO8601 timestamp
   * @param {number} [data.scheduled_end_time] - ISO8601 timestamp (required for external events)
   * @param {number} data.entity_type - The entity type (1=stage, 2=voice, 3=external)
   * @param {string} [data.channel_id] - Channel ID (required for stage/voice events)
   * @param {string} [data.entity_metadata] - External event metadata
   * @param {string} [data.image] - Base64 encoded cover image
   * @returns {Promise<Object>} The created event object
   * 
   * @example
   * const event = await guilds.createScheduledEvent('123456789', {
   *   name: 'Community Meeting',
   *   description: 'Weekly community meeting',
   *   scheduled_start_time: new Date(Date.now() + 86400000).toISOString(),
   *   entity_type: 2,
   *   channel_id: 'voice_channel_id'
   * });
   */
  async createScheduledEvent(guildId, data) {
    return this.rest.post(`/guilds/${guildId}/scheduled-events`, { body: data });
  }

  /**
   * Gets a specific scheduled event.
   * 
   * @param {string} guildId - The guild ID
   * @param {string} eventId - The event ID
   * @param {Object} [options] - Optional parameters
   * @param {boolean} [options.with_user_count] - Whether to include user count
   * @returns {Promise<Object>} The scheduled event object
   * 
   * @example
   * const event = await guilds.getScheduledEvent('123456789', 'event_id');
   */
  async getScheduledEvent(guildId, eventId, options = {}) {
    const params = new URLSearchParams();
    if (options.with_user_count) params.append('with_user_count', 'true');
    
    return this.rest.get(`/guilds/${guildId}/scheduled-events/${eventId}?${params}`);
  }

  /**
   * Modifies a scheduled event.
   * Requires MANAGE_EVENTS permission.
   * 
   * @param {string} guildId - The guild ID
   * @param {string} eventId - The event ID
   * @param {Object} data - Event modification data
   * @returns {Promise<Object>} The modified event object
   * 
   * @example
   * const event = await guilds.modifyScheduledEvent('123456789', 'event_id', {
   *   name: 'Updated Event Name'
   * });
   */
  async modifyScheduledEvent(guildId, eventId, data) {
    return this.rest.patch(`/guilds/${guildId}/scheduled-events/${eventId}`, { body: data });
  }

  /**
   * Deletes a scheduled event.
   * Requires MANAGE_EVENTS permission.
   * 
   * @param {string} guildId - The guild ID
   * @param {string} eventId - The event ID
   * @returns {Promise<Object>} Empty object on success
   * 
   * @example
   * await guilds.deleteScheduledEvent('123456789', 'event_id');
   */
  async deleteScheduledEvent(guildId, eventId) {
    return this.rest.delete(`/guilds/${guildId}/scheduled-events/${eventId}`);
  }

  /**
   * Gets users interested in a scheduled event.
   * 
   * @param {string} guildId - The guild ID
   * @param {string} eventId - The event ID
   * @param {Object} [options] - Optional parameters
   * @param {number} [options.limit] - Number of users to return (1-100)
   * @param {boolean} [options.with_member] - Whether to include member data
   * @param {string} [options.before] - Return users before this user ID
   * @param {string} [options.after] - Return users after this user ID
   * @returns {Promise<Array>} Array of user objects
   * 
   * @example
   * const users = await guilds.getScheduledEventUsers('123456789', 'event_id', { limit: 100 });
   */
  async getScheduledEventUsers(guildId, eventId, options = {}) {
    const params = new URLSearchParams();
    if (options.limit) params.append('limit', options.limit);
    if (options.with_member) params.append('with_member', 'true');
    if (options.before) params.append('before', options.before);
    if (options.after) params.append('after', options.after);
    
    return this.rest.get(`/guilds/${guildId}/scheduled-events/${eventId}/users?${params}`);
  }

  /**
   * Gets templates for a guild.
   * Requires MANAGE_GUILD permission.
   * 
   * @param {string} guildId - The guild ID
   * @returns {Promise<Array>} Array of template objects
   * 
   * @example
   * const templates = await guilds.getTemplates('123456789');
   */
  async getTemplates(guildId) {
    return this.rest.get(`/guilds/${guildId}/templates`);
  }

  /**
   * Creates a guild template.
   * Requires MANAGE_GUILD permission.
   * 
   * @param {string} guildId - The guild ID
   * @param {Object} data - Template data
   * @param {string} data.name - The template name (1-100 characters)
   * @param {string} [data.description] - The template description (0-120 characters)
   * @returns {Promise<Object>} The created template object
   * 
   * @example
   * const template = await guilds.createTemplate('123456789', {
   *   name: 'My Server Template',
   *   description: 'A template for my community'
   * });
   */
  async createTemplate(guildId, data) {
    return this.rest.post(`/guilds/${guildId}/templates`, { body: data });
  }

  /**
   * Syncs a template to the guild's current state.
   * Requires MANAGE_GUILD permission.
   * 
   * @param {string} guildId - The guild ID
   * @param {string} templateCode - The template code
   * @returns {Promise<Object>} The synced template object
   * 
   * @example
   * const template = await guilds.syncTemplate('123456789', 'template_code');
   */
  async syncTemplate(guildId, templateCode) {
    return this.rest.put(`/guilds/${guildId}/templates/${templateCode}`);
  }

  /**
   * Modifies a guild template.
   * Requires MANAGE_GUILD permission.
   * 
   * @param {string} guildId - The guild ID
   * @param {string} templateCode - The template code
   * @param {Object} data - Template modification data
   * @returns {Promise<Object>} The modified template object
   * 
   * @example
   * const template = await guilds.modifyTemplate('123456789', 'template_code', {
   *   name: 'Updated Template Name'
   * });
   */
  async modifyTemplate(guildId, templateCode, data) {
    return this.rest.patch(`/guilds/${guildId}/templates/${templateCode}`, { body: data });
  }

  /**
   * Deletes a guild template.
   * Requires MANAGE_GUILD permission.
   * 
   * @param {string} guildId - The guild ID
   * @param {string} templateCode - The template code
   * @returns {Promise<Object>} The deleted template object
   * 
   * @example
   * await guilds.deleteTemplate('123456789', 'template_code');
   */
  async deleteTemplate(guildId, templateCode) {
    return this.rest.delete(`/guilds/${guildId}/templates/${templateCode}`);
  }
}
