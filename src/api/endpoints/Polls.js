/**
 * Poll Endpoints
 * 
 * Provides methods for managing Discord polls in messages.
 * Polls allow users to vote on options in messages.
 * 
 * @example
 * import { Client } from 'double';
 * const client = new Client({ token });
 * await client.connect();
 * 
 * // Get poll answer voters
 * const voters = await client.polls.getAnswerVoters('channel_id', 'message_id', 1);
 * 
 * // End a poll
 * const message = await client.polls.endPoll('channel_id', 'message_id');
 */

export class PollEndpoints {
  constructor(rest) {
    this.rest = rest;
  }

  /**
   * Gets users who voted for a specific poll answer.
   * Requires READ_MESSAGE_HISTORY permission.
   * 
   * @param {string} channelId - The channel ID
   * @param {string} messageId - The message ID
   * @param {number} answerId - The answer ID
   * @param {Object} [options] - Optional query parameters
   * @param {string} [options.after] - Get users after this user ID
   * @param {number} [options.limit] - Number of users to return (1-100)
   * @returns {Promise<Object>} Object with users array
   * 
   * @example
   * const voters = await polls.getAnswerVoters('123456789', 'msg_id', 1, { limit: 50 });
   * voters.users.forEach(user => {
   *   console.log(`${user.username} voted for option 1`);
   * });
   */
  async getAnswerVoters(channelId, messageId, answerId, options = {}) {
    const params = new URLSearchParams();
    if (options.after) params.append('after', options.after);
    if (options.limit) params.append('limit', options.limit);
    
    return this.rest.get(`/channels/${channelId}/polls/${messageId}/answers/${answerId}?${params}`);
  }

  /**
   * Ends a poll before its scheduled end time.
   * Requires SEND_MESSAGES permission.
   * 
   * @param {string} channelId - The channel ID
   * @param {string} messageId - The message ID
   * @returns {Promise<Object>} The updated message object with poll results
   * 
   * @example
   * const message = await polls.endPoll('123456789', 'msg_id');
   * console.log('Poll ended with results:', message.poll);
   */
  async endPoll(channelId, messageId) {
    return this.rest.post(`/channels/${channelId}/polls/${messageId}/expire`, {});
  }
}
