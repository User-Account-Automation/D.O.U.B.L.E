/**
 * Account Endpoints
 * 
 * Provides methods for managing the user account profile and settings.
 * This includes profile customization, status, and account preferences.
 * 
 * @example
 * import { Client } from 'double';
 * const client = new Client({ token });
 * await client.connect();
 * 
 * // Get current user profile
 * const profile = await client.account.getProfile();
 * 
 * // Update status
 * await client.account.setStatus({
 *   status: 'online',
 *   custom_status: { text: 'Working' }
 * });
 */

export class AccountEndpoints {
  constructor(rest) {
    this.rest = rest;
  }

  /**
   * Gets the current user's profile.
   * 
   * @returns {Promise<Object>} The user profile object
   * 
   * @example
   * const profile = await account.getProfile();
   * console.log(`Bio: ${profile.bio}`);
   */
  async getProfile() {
    return this.rest.get('/users/@me');
  }

  /**
   * Modifies the current user's profile.
   * 
   * @param {Object} data - Profile modification data
   * @param {string} [data.username] - New username
   * @param {string} [data.avatar] - Base64 encoded avatar
   * @param {string} [data.discriminator] - New discriminator
   * @returns {Promise<Object>} The modified user object
   * 
   * @example
   * const user = await account.modifyProfile({
   *   username: 'NewUsername'
   * });
   */
  async modifyProfile(data) {
    return this.rest.patch('/users/@me', { body: data });
  }

  /**
   * Sets the user's status.
   * 
   * @param {Object} data - Status data
   * @param {string} [data.status] - Status (online, idle, dnd, invisible)
   * @param {Object} [data.custom_status] - Custom status object
   * @param {string} [data.custom_status.text] - Custom status text
   * @returns {Promise<Object>} The updated user object
   * 
   * @example
   * await account.setStatus({
   *   status: 'online',
   *   custom_status: { text: 'Coding' }
   * });
   */
  async setStatus(data) {
    return this.rest.patch('/users/@me/settings', { body: data });
  }

  /**
   * Gets the user's account settings.
   * 
   * @returns {Promise<Object>} The settings object
   * 
   * @example
   * const settings = await account.getSettings();
   * console.log(`Locale: ${settings.locale}`);
   */
  async getSettings() {
    return this.rest.get('/users/@me/settings');
  }

  /**
   * Modifies the user's account settings.
   * 
   * @param {Object} data - Settings modification data
   * @returns {Promise<Object>} The modified settings object
   * 
   * @example
   * const settings = await account.modifySettings({
   *   locale: 'en-US',
   *   theme: 'dark'
   * });
   */
  async modifySettings(data) {
    return this.rest.patch('/users/@me/settings', { body: data });
  }
}
