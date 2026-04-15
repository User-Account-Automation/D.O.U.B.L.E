/**
 * Relationship Endpoints
 * 
 * Provides methods for managing Discord relationships (friends and blocked users).
 * This includes sending friend requests, accepting/rejecting requests, and blocking users.
 * 
 * @example
 * import { Client } from 'double';
 * const client = new Client({ token });
 * await client.connect();
 * 
 * // Get all relationships
 * const relationships = await client.relationships.getAll();
 * 
 * // Send a friend request
 * await client.relationships.sendFriendRequest('username#1234');
 */

export class RelationshipEndpoints {
  constructor(rest) {
    this.rest = rest;
  }

  /**
   * Gets all relationships for the current user.
   * 
   * @returns {Promise<Array>} Array of relationship objects
   * 
   * @example
   * const relationships = await relationships.getAll();
   * relationships.forEach(rel => {
   *   console.log(`${rel.user.username}: ${rel.type}`);
   * });
   */
  async getAll() {
    return this.rest.get('/users/@me/relationships');
  }

  /**
   * Gets all friends (relationships of type 1).
   * 
   * @returns {Promise<Array>} Array of friend relationship objects
   * 
   * @example
   * const friends = await relationships.getFriends();
   * friends.forEach(friend => {
   *   console.log(`${friend.user.username}`);
   * });
   */
  async getFriends() {
    const relationships = await this.rest.get('/users/@me/relationships');
    return relationships.filter(rel => rel.type === 1);
  }

  /**
   * Gets a specific relationship by user ID.
   * 
   * @param {string} userId - The user ID
   * @returns {Promise<Object>} The relationship object
   * 
   * @example
   * const relationship = await relationships.get('123456789');
   */
  async get(userId) {
    const relationships = await this.rest.get('/users/@me/relationships');
    return relationships.find(rel => rel.id === userId);
  }

  /**
   * Sends a friend request to a user.
   * 
   * @param {string} username - The username with discriminator (e.g., 'username#1234')
   * @returns {Promise<Object>} The relationship object
   * 
   * @example
   * const relationship = await relationships.sendFriendRequest('username#1234');
   */
  async sendFriendRequest(username) {
    const [user, discriminator] = username.split('#');
    return this.rest.post('/users/@me/relationships', {
      body: { username, discriminator }
    });
  }

  /**
   * Accepts a friend request or adds a friend.
   * 
   * @param {string} userId - The user ID
   * @returns {Promise<Object>} The relationship object
   * 
   * @example
   * const relationship = await relationships.accept('123456789');
   */
  async accept(userId) {
    return this.rest.put(`/users/@me/relationships/${userId}`, {});
  }

  /**
   * Deletes a relationship (removes friend or blocks user).
   * 
   * @param {string} userId - The user ID
   * @returns {Promise<Object>} Empty object on success
   * 
   * @example
   * await relationships.remove('123456789');
   */
  async remove(userId) {
    return this.rest.delete(`/users/@me/relationships/${userId}`);
  }

  /**
   * Blocks a user.
   * 
   * @param {string} userId - The user ID
   * @returns {Promise<Object>} The relationship object
   * 
   * @example
   * const relationship = await relationships.block('123456789');
   */
  async block(userId) {
    return this.rest.put(`/users/@me/relationships/${userId}`, {
      body: { type: 2 }
    });
  }

  /**
   * Unblocks a user.
   * 
   * @param {string} userId - The user ID
   * @returns {Promise<Object>} Empty object on success
   * 
   * @example
   * await relationships.unblock('123456789');
   */
  async unblock(userId) {
    return this.rest.delete(`/users/@me/relationships/${userId}`);
  }
}
