/**
 * User Endpoints
 * 
 * Provides methods for managing Discord user accounts and user-specific data.
 * This includes profile management, guilds, DMs, connections, and settings.
 * 
 * @example
 * import { Client } from 'double';
 * const client = new Client({ token });
 * await client.connect();
 * 
 * // Get current user
 * const user = await client.users.getCurrentUser();
 * console.log(`Username: ${user.username}`);
 * 
 * // Modify profile
 * await client.users.modifyCurrentUser({
 *   username: 'NewUsername'
 * });
 */

export class UserEndpoints {
  constructor(rest) {
    this.rest = rest;
  }

  /**
   * Gets a user by ID.
   * 
   * @param {string} userId - The user ID
   * @returns {Promise<Object>} The user object
   * 
   * @example
   * const user = await users.getUser('123456789');
   * console.log(`Username: ${user.username}`);
   */
  async getUser(userId) {
    return this.rest.get(`/users/${userId}`);
  }

  /**
   * Gets the current user.
   * 
   * @returns {Promise<Object>} The current user object
   * 
   * @example
   * const user = await users.getCurrentUser();
   * console.log(`ID: ${user.id}`);
   */
  async getCurrentUser() {
    return this.rest.get('/users/@me');
  }

  /**
   * Modifies the current user.
   * 
   * @param {Object} data - User modification data
   * @param {string} [data.username] - New username (2-32 characters)
   * @param {string} [data.avatar] - Base64 encoded avatar
   * @param {string} [data.discriminator] - New discriminator (4 digits)
   * @returns {Promise<Object>} The modified user object
   * 
   * @example
   * const user = await users.modifyCurrentUser({
   *   username: 'NewUsername'
   * });
   */
  async modifyCurrentUser(data) {
    return this.rest.patch('/users/@me', { body: data });
  }

  /**
   * Gets the current user's guilds.
   * 
   * @param {Object} [options] - Optional query parameters
   * @param {number} [options.limit] - Number of guilds to return (1-200)
   * @param {string} [options.before] - Get guilds before this guild ID
   * @param {string} [options.after] - Get guilds after this guild ID
   * @returns {Promise<Array>} Array of partial guild objects
   * 
   * @example
   * const guilds = await users.getCurrentUserGuilds({ limit: 100 });
   * guilds.forEach(guild => {
   *   console.log(`${guild.name}: ${guild.id}`);
   * });
   */
  async getCurrentUserGuilds(options = {}) {
    const params = new URLSearchParams();
    if (options.limit) params.append('limit', options.limit);
    if (options.before) params.append('before', options.before);
    if (options.after) params.append('after', options.after);
    
    return this.rest.get(`/users/@me/guilds?${params}`);
  }

  /**
   * Leaves a guild.
   * 
   * @param {string} guildId - The guild ID
   * @returns {Promise<Object>} Empty object on success
   * 
   * @example
   * await users.leaveGuild('123456789');
   */
  async leaveGuild(guildId) {
    return this.rest.delete(`/users/@me/guilds/${guildId}`);
  }

  /**
   * Gets the current user's DM channels.
   * 
   * @returns {Promise<Array>} Array of DM channel objects
   * 
   * @example
   * const dms = await users.getUserDMs();
   * dms.forEach(dm => {
   *   console.log(`DM with: ${dm.recipients[0].username}`);
   * });
   */
  async getUserDMs() {
    return this.rest.get('/users/@me/channels');
  }

  /**
   * Creates a DM channel with a user.
   * 
   * @param {string} userId - The user ID to create a DM with
   * @returns {Promise<Object>} The DM channel object
   * 
   * @example
   * const dm = await users.createDM('123456789');
   * console.log(`DM channel ID: ${dm.id}`);
   */
  async createDM(userId) {
    return this.rest.post('/users/@me/channels', {
      body: { recipient_id: userId }
    });
  }

  /**
   * Gets the current user's connections.
   * 
   * @returns {Promise<Array>} Array of connection objects
   * 
   * @example
   * const connections = await users.getUserConnections();
   * connections.forEach(conn => {
   *   console.log(`${conn.type}: ${conn.name}`);
   * });
   */
  async getUserConnections() {
    return this.rest.get('/users/@me/connections');
  }

  /**
   * Gets the current user's settings.
   * 
   * @returns {Promise<Object>} The user settings object
   * 
   * @example
   * const settings = await users.getUserSettings();
   * console.log(`Locale: ${settings.locale}`);
   */
  async getUserSettings() {
    return this.rest.get('/users/@me/settings');
  }

  /**
   * Modifies the current user's settings.
   * 
   * @param {Object} data - Settings modification data
   * @returns {Promise<Object>} The modified settings object
   * 
   * @example
   * const settings = await users.modifyUserSettings({
   *   locale: 'en-US'
   * });
   */
  async modifyUserSettings(data) {
    return this.rest.patch('/users/@me/settings', { body: data });
  }

  /**
   * Gets the current user's profile.
   * 
   * @returns {Promise<Object>} The user profile object
   * 
   * @example
   * const profile = await users.getUserProfile();
   * console.log(`Bio: ${profile.bio}`);
   */
  async getUserProfile() {
    return this.rest.get('/users/@me/profile');
  }

  /**
   * Modifies the current user's profile.
   * 
   * @param {Object} data - Profile modification data
   * @param {string} [data.bio] - The new bio (0-190 characters)
   * @returns {Promise<Object>} The modified profile object
   * 
   * @example
   * const profile = await users.modifyUserProfile({
   *   bio: 'New bio'
   * });
   */
  async modifyUserProfile(data) {
    return this.rest.patch('/users/@me/profile', { body: data });
  }
}
