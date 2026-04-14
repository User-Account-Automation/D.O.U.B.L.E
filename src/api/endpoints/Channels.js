/**
 * Channel Endpoints
 * 
 * Provides methods for managing Discord channels and messages.
 * This includes text channels, voice channels, DMs, group DMs, and channel categories.
 * 
 * @example
 * import { Client } from 'double';
 * const client = new Client({ token });
 * await client.connect();
 * 
 * // Get a channel
 * const channel = await client.channels.getChannel('channel_id');
 * 
 * // Send a message
 * const message = await client.channels.sendMessage('channel_id', {
 *   content: 'Hello, world!'
 * });
 */

export class ChannelEndpoints {
  constructor(rest) {
    this.rest = rest;
  }

  /**
   * Gets a channel by ID.
   * 
   * @param {string} channelId - The channel ID
   * @returns {Promise<Object>} The channel object
   * 
   * @example
   * const channel = await channels.getChannel('123456789');
   * console.log(`Channel: ${channel.name}`);
   */
  async getChannel(channelId) {
    return this.rest.get(`/channels/${channelId}`);
  }

  /**
   * Modifies a channel.
   * Requires appropriate permissions based on the modifications.
   * 
   * @param {string} channelId - The channel ID
   * @param {Object} data - Channel modification data
   * @param {string} [data.name] - The new channel name (1-100 characters)
   * @param {string} [data.topic] - The new channel topic (0-1024 characters)
   * @param {number} [data.bitrate] - Voice channel bitrate (8000-96000)
   * @param {number} [data.user_limit] - Voice channel user limit (0-99)
   * @param {number} [data.rate_limit_per_user] - Slowmode duration in seconds (0-21600)
   * @param {number} [data.position] - Sorting position
   * @param {Object} [data.permission_overwrites] - Permission overwrites
   * @param {string} [data.parent_id] - Parent category ID
   * @param {boolean} [data.nsfw] - Whether the channel is NSFW
   * @param {number} [data.default_auto_archive_duration] - Default thread archive duration
   * @returns {Promise<Object>} The modified channel object
   * 
   * @example
   * const channel = await channels.modifyChannel('123456789', {
   *   name: 'general',
   *   topic: 'General discussion',
   *   nsfw: false
   * });
   */
  async modifyChannel(channelId, data) {
    return this.rest.patch(`/channels/${channelId}`, { body: data });
  }

  /**
   * Deletes a channel.
   * Requires MANAGE_CHANNELS permission.
   * 
   * @param {string} channelId - The channel ID
   * @returns {Promise<Object>} Empty object on success
   * 
   * @example
   * await channels.deleteChannel('123456789');
   */
  async deleteChannel(channelId) {
    return this.rest.delete(`/channels/${channelId}`);
  }

  /**
   * Gets messages from a channel.
   * Requires READ_MESSAGE_HISTORY permission.
   * 
   * @param {string} channelId - The channel ID
   * @param {Object} [options] - Optional query parameters
   * @param {number} [options.limit] - Number of messages to return (1-100)
   * @param {string} [options.before] - Get messages before this message ID
   * @param {string} [options.after] - Get messages after this message ID
   * @param {string} [options.around] - Get messages around this message ID
   * @returns {Promise<Array>} Array of message objects
   * 
   * @example
   * const messages = await channels.getMessages('123456789', {
   *   limit: 50,
   *   before: 'message_id'
   * });
   */
  async getMessages(channelId, options = {}) {
    const params = new URLSearchParams();
    if (options.limit) params.append('limit', options.limit);
    if (options.before) params.append('before', options.before);
    if (options.after) params.append('after', options.after);
    if (options.around) params.append('around', options.around);
    
    return this.rest.get(`/channels/${channelId}/messages?${params}`);
  }

  /**
   * Gets a specific message.
   * Requires READ_MESSAGE_HISTORY permission.
   * 
   * @param {string} channelId - The channel ID
   * @param {string} messageId - The message ID
   * @returns {Promise<Object>} The message object
   * 
   * @example
   * const message = await channels.getMessage('123456789', 'message_id');
   */
  async getMessage(channelId, messageId) {
    return this.rest.get(`/channels/${channelId}/messages/${messageId}`);
  }

  /**
   * Sends a message to a channel.
   * Requires SEND_MESSAGES permission.
   * 
   * @param {string} channelId - The channel ID
   * @param {Object} data - Message data
   * @param {string} [data.content] - The message content (0-2000 characters)
   * @param {string} [data.nonce] - Used for deduplication
   * @param {boolean} [data.tts] - Whether this is a TTS message
   * @param {Array<Object>} [data.embeds] - Array of embed objects
   * @param {Array<Object>} [data.components] - Array of message components
   * @param {Array<Object>} [data.sticker_ids] - Array of sticker IDs
   * @param {Object} [data.allowed_mentions] - Allowed mentions object
   * @param {Array<Object>} [data.files] - Array of file attachments
   * @param {Object} [data.poll] - Poll object
   * @returns {Promise<Object>} The created message object
   * 
   * @example
   * const message = await channels.sendMessage('123456789', {
   *   content: 'Hello, world!'
   * });
   */
  async sendMessage(channelId, data) {
    return this.rest.post(`/channels/${channelId}/messages`, { body: data });
  }

  /**
   * Edits a message.
   * Requires MESSAGE_EDIT permission if not the author.
   * 
   * @param {string} channelId - The channel ID
   * @param {string} messageId - The message ID
   * @param {Object} data - Message edit data
   * @param {string} [data.content] - The new message content
   * @param {Array<Object>} [data.embeds] - Array of embed objects
   * @param {Array<Object>} [data.components] - Array of message components
   * @param {Array<Object>} [data.files] - Array of file attachments
   * @param {Object} [data.allowed_mentions] - Allowed mentions object
   * @param {Array<string>} [data.attachments] - Array of attachment IDs to keep
   * @returns {Promise<Object>} The edited message object
   * 
   * @example
   * const message = await channels.editMessage('123456789', 'message_id', {
   *   content: 'Updated message'
   * });
   */
  async editMessage(channelId, messageId, data) {
    return this.rest.patch(`/channels/${channelId}/messages/${messageId}`, { body: data });
  }

  /**
   * Deletes a message.
   * Requires MANAGE_MESSAGES permission if not the author.
   * 
   * @param {string} channelId - The channel ID
   * @param {string} messageId - The message ID
   * @returns {Promise<Object>} Empty object on success
   * 
   * @example
   * await channels.deleteMessage('123456789', 'message_id');
   */
  async deleteMessage(channelId, messageId) {
    return this.rest.delete(`/channels/${channelId}/messages/${messageId}`);
  }

  /**
   * Bulk deletes multiple messages.
   * Requires MANAGE_MESSAGES permission.
   * Can delete up to 100 messages at once.
   * Messages must be younger than 14 days.
   * 
   * @param {string} channelId - The channel ID
   * @param {Array<string>} messageIds - Array of message IDs (2-100)
   * @returns {Promise<Object>} Empty object on success
   * 
   * @example
   * await channels.bulkDeleteMessages('123456789', ['msg1', 'msg2', 'msg3']);
   */
  async bulkDeleteMessages(channelId, messageIds) {
    return this.rest.post(`/channels/${channelId}/messages/bulk-delete`, {
      body: { messages: messageIds }
    });
  }

  /**
   * Gets pinned messages in a channel.
   * Requires READ_MESSAGE_HISTORY permission.
   * 
   * @param {string} channelId - The channel ID
   * @returns {Promise<Array>} Array of pinned message objects
   * 
   * @example
   * const pinned = await channels.getPinnedMessages('123456789');
   */
  async getPinnedMessages(channelId) {
    return this.rest.get(`/channels/${channelId}/pins`);
  }

  /**
   * Pins a message in a channel.
   * Requires MANAGE_MESSAGES permission.
   * 
   * @param {string} channelId - The channel ID
   * @param {string} messageId - The message ID
   * @returns {Promise<Object>} Empty object on success
   * 
   * @example
   * await channels.pinMessage('123456789', 'message_id');
   */
  async pinMessage(channelId, messageId) {
    return this.rest.put(`/channels/${channelId}/pins/${messageId}`);
  }

  /**
   * Unpins a message in a channel.
   * Requires MANAGE_MESSAGES permission.
   * 
   * @param {string} channelId - The channel ID
   * @param {string} messageId - The message ID
   * @returns {Promise<Object>} Empty object on success
   * 
   * @example
   * await channels.unpinMessage('123456789', 'message_id');
   */
  async unpinMessage(channelId, messageId) {
    return this.rest.delete(`/channels/${channelId}/pins/${messageId}`);
  }

  /**
   * Crossposts a message to following channels.
   * Only works for announcement channels.
   * Requires MANAGE_MESSAGES permission.
   * 
   * @param {string} channelId - The channel ID
   * @param {string} messageId - The message ID
   * @returns {Promise<Object>} The crossposted message object
   * 
   * @example
   * const message = await channels.crosspostMessage('123456789', 'message_id');
   */
  async crosspostMessage(channelId, messageId) {
    return this.rest.post(`/channels/${channelId}/messages/${messageId}/crosspost`);
  }

  /**
   * Triggers a typing indicator in a channel.
   * The typing indicator lasts for 10 seconds.
   * Requires SEND_MESSAGES permission.
   * 
   * @param {string} channelId - The channel ID
   * @returns {Promise<Object>} Empty object on success
   * 
   * @example
   * await channels.triggerTyping('123456789');
   */
  async triggerTyping(channelId) {
    return this.rest.post(`/channels/${channelId}/typing`);
  }

  /**
   * Adds a reaction to a message.
   * Requires READ_MESSAGE_HISTORY and ADD_REACTIONS permissions.
   * 
   * @param {string} channelId - The channel ID
   * @param {string} messageId - The message ID
   * @param {string} emoji - The emoji to add (unicode or custom format)
   * @returns {Promise<Object>} Empty object on success
   * 
   * @example
   * await channels.addReaction('123456789', 'message_id', '👍');
   * await channels.addReaction('123456789', 'message_id', 'emoji_name:emoji_id');
   */
  async addReaction(channelId, messageId, emoji) {
    return this.rest.put(`/channels/${channelId}/messages/${messageId}/reactions/${emoji}/@me`);
  }

  /**
   * Removes a reaction from a message.
   * Requires READ_MESSAGE_HISTORY permission.
   * 
   * @param {string} channelId - The channel ID
   * @param {string} messageId - The message ID
   * @param {string} emoji - The emoji to remove
   * @param {string} [userId] - The user ID whose reaction to remove (default: @me)
   * @returns {Promise<Object>} Empty object on success
   * 
   * @example
   * await channels.removeReaction('123456789', 'message_id', '👍');
   * await channels.removeReaction('123456789', 'message_id', '👍', 'user_id');
   */
  async removeReaction(channelId, messageId, emoji, userId = '@me') {
    return this.rest.delete(`/channels/${channelId}/messages/${messageId}/reactions/${emoji}/${userId}`);
  }

  /**
   * Gets reactions for a message.
   * Requires READ_MESSAGE_HISTORY permission.
   * 
   * @param {string} channelId - The channel ID
   * @param {string} messageId - The message ID
   * @param {string} emoji - The emoji to get reactions for
   * @param {Object} [options] - Optional query parameters
   * @param {string} [options.before] - Get users before this user ID
   * @param {string} [options.after] - Get users after this user ID
   * @param {number} [options.limit] - Number of users to return (1-100)
   * @returns {Promise<Array>} Array of user objects
   * 
   * @example
   * const users = await channels.getReactions('123456789', 'message_id', '👍', { limit: 50 });
   */
  async getReactions(channelId, messageId, emoji, options = {}) {
    const params = new URLSearchParams();
    if (options.before) params.append('before', options.before);
    if (options.after) params.append('after', options.after);
    if (options.limit) params.append('limit', options.limit);
    
    return this.rest.get(`/channels/${channelId}/messages/${messageId}/reactions/${emoji}?${params}`);
  }

  /**
   * Removes all reactions for a specific emoji.
   * Requires MANAGE_MESSAGES permission.
   * 
   * @param {string} channelId - The channel ID
   * @param {string} messageId - The message ID
   * @param {string} emoji - The emoji to clear reactions for
   * @returns {Promise<Object>} Empty object on success
   * 
   * @example
   * await channels.removeReactionEmoji('123456789', 'message_id', '👍');
   */
  async removeReactionEmoji(channelId, messageId, emoji) {
    return this.rest.delete(`/channels/${channelId}/messages/${messageId}/reactions/${emoji}`);
  }

  /**
   * Removes all reactions from a message.
   * Requires MANAGE_MESSAGES permission.
   * 
   * @param {string} channelId - The channel ID
   * @param {string} messageId - The message ID
   * @returns {Promise<Object>} Empty object on success
   * 
   * @example
   * await channels.removeAllReactions('123456789', 'message_id');
   */
  async removeAllReactions(channelId, messageId) {
    return this.rest.delete(`/channels/${channelId}/messages/${messageId}/reactions`);
  }

  /**
   * Gets permission overwrites for a channel.
   * 
   * @param {string} channelId - The channel ID
   * @returns {Promise<Array>} Array of permission overwrite objects
   * 
   * @example
   * const overwrites = await channels.getPermissionOverwrites('123456789');
   */
  async getPermissionOverwrites(channelId) {
    return this.rest.get(`/channels/${channelId}/permissions`);
  }

  /**
   * Gets a specific permission overwrite.
   * 
   * @param {string} channelId - The channel ID
   * @param {string} overwriteId - The overwrite ID (role or user ID)
   * @returns {Promise<Object>} The permission overwrite object
   * 
   * @example
   * const overwrite = await channels.getPermissionOverwrite('123456789', 'role_id');
   */
  async getPermissionOverwrite(channelId, overwriteId) {
    return this.rest.get(`/channels/${channelId}/permissions/${overwriteId}`);
  }

  /**
   * Creates a permission overwrite.
   * Requires MANAGE_ROLES permission.
   * 
   * @param {string} channelId - The channel ID
   * @param {string} overwriteId - The overwrite ID (role or user ID)
   * @param {Object} data - Overwrite data
   * @param {number} data.allow - Permission bit flags for allow
   * @param {number} data.deny - Permission bit flags for deny
   * @param {number} data.type - The type (0=role, 1=member)
   * @returns {Promise<Object>} The created permission overwrite object
   * 
   * @example
   * const overwrite = await channels.createPermissionOverwrite('123456789', 'role_id', {
   *   allow: 1024,
   *   deny: 0,
   *   type: 0
   * });
   */
  async createPermissionOverwrite(channelId, overwriteId, data) {
    return this.rest.put(`/channels/${channelId}/permissions/${overwriteId}`, { body: data });
  }

  /**
   * Edits a permission overwrite.
   * Requires MANAGE_ROLES permission.
   * 
   * @param {string} channelId - The channel ID
   * @param {string} overwriteId - The overwrite ID (role or user ID)
   * @param {Object} data - Overwrite modification data
   * @returns {Promise<Object>} The modified permission overwrite object
   * 
   * @example
   * const overwrite = await channels.editPermissionOverwrite('123456789', 'role_id', {
   *   allow: 2048
   * });
   */
  async editPermissionOverwrite(channelId, overwriteId, data) {
    return this.rest.patch(`/channels/${channelId}/permissions/${overwriteId}`, { body: data });
  }

  /**
   * Deletes a permission overwrite.
   * Requires MANAGE_ROLES permission.
   * 
   * @param {string} channelId - The channel ID
   * @param {string} overwriteId - The overwrite ID (role or user ID)
   * @returns {Promise<Object>} Empty object on success
   * 
   * @example
   * await channels.deletePermissionOverwrite('123456789', 'role_id');
   */
  async deletePermissionOverwrite(channelId, overwriteId) {
    return this.rest.delete(`/channels/${channelId}/permissions/${overwriteId}`);
  }

  /**
   * Gets invites for a channel.
   * Requires MANAGE_CHANNELS permission.
   * 
   * @param {string} channelId - The channel ID
   * @returns {Promise<Array>} Array of invite objects
   * 
   * @example
   * const invites = await channels.getChannelInvites('123456789');
   */
  async getChannelInvites(channelId) {
    return this.rest.get(`/channels/${channelId}/invites`);
  }

  /**
   * Creates an invite for a channel.
   * Requires CREATE_INSTANT_INVITE permission.
   * 
   * @param {string} channelId - The channel ID
   * @param {Object} [data] - Invite creation options
   * @param {number} [data.max_age] - Duration in seconds before expiration (0-604800)
   * @param {number} [data.max_uses] - Maximum number of uses (0 for unlimited)
   * @param {boolean} [data.temporary] - Whether membership is temporary
   * @param {boolean} [data.unique] - Whether the invite should be unique
   * @param {number} [data.target_type] - Target type (1=stream, 2=embedded application)
   * @param {string} [data.target_user_id] - User ID for stream invite
   * @param {string} [data.target_application_id] - Application ID for embedded invite
   * @returns {Promise<Object>} The created invite object
   * 
   * @example
   * const invite = await channels.createInvite('123456789', {
   *   max_age: 86400,
   *   max_uses: 100
   * });
   */
  async createInvite(channelId, data = {}) {
    return this.rest.post(`/channels/${channelId}/invites`, { body: data });
  }

  /**
   * Deletes an invite.
   * Requires MANAGE_CHANNELS permission.
   * 
   * @param {string} channelId - The channel ID
   * @param {string} inviteCode - The invite code
   * @returns {Promise<Object>} The deleted invite object
   * 
   * @example
   * await channels.deleteInvite('123456789', 'abc123');
   */
  async deleteInvite(channelId, inviteCode) {
    return this.rest.delete(`/invites/${inviteCode}`);
  }

  /**
   * Follows an announcement channel.
   * Requires VIEW_CHANNEL and SEND_MESSAGES permissions.
   * 
   * @param {string} channelId - The announcement channel ID
   * @param {Object} data - Follow data
   * @param {string} data.webhook_channel_id - The target channel ID
   * @returns {Promise<Object>} The followed channel object
   * 
   * @example
   * const result = await channels.followAnnouncement('123456789', {
   *   webhook_channel_id: 'target_channel_id'
   * });
   */
  async followAnnouncement(channelId, data) {
    return this.rest.post(`/channels/${channelId}/followers`, { body: data });
  }

  /**
   * Starts a thread from a message.
   * Requires CREATE_PUBLIC_THREADS permission.
   * 
   * @param {string} channelId - The channel ID
   * @param {string} messageId - The message ID
   * @param {Object} data - Thread data
   * @param {string} data.name - The thread name (0-100 characters)
   * @param {number} [data.auto_archive_duration] - Auto archive duration (60, 1440, 4320, 10080)
   * @param {number} [data.rate_limit_per_user] - Slowmode duration (0-21600)
   * @returns {Promise<Object>} The created thread object
   * 
   * @example
   * const thread = await channels.startThreadFromMessage('123456789', 'message_id', {
   *   name: 'Discussion',
   *   auto_archive_duration: 1440
   * });
   */
  async startThreadFromMessage(channelId, messageId, data) {
    return this.rest.post(`/channels/${channelId}/messages/${messageId}/threads`, { body: data });
  }

  /**
   * Starts a thread without a message.
   * Requires CREATE_PUBLIC_THREADS or CREATE_PRIVATE_THREADS permission.
   * 
   * @param {string} channelId - The channel ID
   * @param {Object} data - Thread data
   * @param {string} data.name - The thread name (0-100 characters)
   * @param {number} data.type - The thread type (10=public, 11=private, 12=news)
   * @param {number} [data.auto_archive_duration] - Auto archive duration
   * @param {number} [data.invitable] - Whether non-moderators can invite others (private threads)
   * @param {number} [data.rate_limit_per_user] - Slowmode duration
   * @returns {Promise<Object>} The created thread object
   * 
   * @example
   * const thread = await channels.startThread('123456789', {
   *   name: 'General Discussion',
   *   type: 10
   * });
   */
  async startThread(channelId, data) {
    return this.rest.post(`/channels/${channelId}/threads`, { body: data });
  }

  /**
   * Gets active threads in a channel.
   * 
   * @param {string} channelId - The channel ID
   * @returns {Promise<Object>} Object with threads array and member array
   * 
   * @example
   * const threads = await channels.getActiveThreads('123456789');
   * threads.threads.forEach(thread => {
   *   console.log(thread.name);
   * });
   */
  async getActiveThreads(channelId) {
    return this.rest.get(`/channels/${channelId}/threads/active`);
  }

  /**
   * Gets archived public threads in a channel.
   * Requires READ_MESSAGE_HISTORY permission.
   * 
   * @param {string} channelId - The channel ID
   * @param {Object} [options] - Optional query parameters
   * @param {string} [options.before] - Get threads before this timestamp
   * @param {number} [options.limit] - Number of threads to return
   * @returns {Promise<Object>} Object with threads array and member array
   * 
   * @example
   * const threads = await channels.getArchivedPublicThreads('123456789', { limit: 50 });
   */
  async getArchivedPublicThreads(channelId, options = {}) {
    const params = new URLSearchParams();
    if (options.before) params.append('before', options.before);
    if (options.limit) params.append('limit', options.limit);
    
    return this.rest.get(`/channels/${channelId}/threads/archived/public?${params}`);
  }

  /**
   * Gets archived private threads in a channel.
   * Requires READ_MESSAGE_HISTORY and MANAGE_THREADS permission.
   * 
   * @param {string} channelId - The channel ID
   * @param {Object} [options] - Optional query parameters
   * @param {string} [options.before] - Get threads before this timestamp
   * @param {number} [options.limit] - Number of threads to return
   * @returns {Promise<Object>} Object with threads array and member array
   * 
   * @example
   * const threads = await channels.getArchivedPrivateThreads('123456789', { limit: 50 });
   */
  async getArchivedPrivateThreads(channelId, options = {}) {
    const params = new URLSearchParams();
    if (options.before) params.append('before', options.before);
    if (options.limit) params.append('limit', options.limit);
    
    return this.rest.get(`/channels/${channelId}/threads/archived/private?${params}`);
  }

  /**
   * Gets archived private threads joined by the current user.
   * 
   * @param {string} channelId - The channel ID
   * @param {Object} [options] - Optional query parameters
   * @param {string} [options.before] - Get threads before this timestamp
   * @param {number} [options.limit] - Number of threads to return
   * @returns {Promise<Object>} Object with threads array and member array
   * 
   * @example
   * const threads = await channels.getJoinedPrivateArchivedThreads('123456789');
   */
  async getJoinedPrivateArchivedThreads(channelId, options = {}) {
    const params = new URLSearchParams();
    if (options.before) params.append('before', options.before);
    if (options.limit) params.append('limit', options.limit);
    
    return this.rest.get(`/channels/${channelId}/users/@me/threads/archived/private?${params}`);
  }
}
