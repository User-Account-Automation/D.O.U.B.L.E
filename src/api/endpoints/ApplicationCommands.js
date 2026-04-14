/**
 * Application Command Endpoints
 * 
 * Provides methods for managing Discord application commands (slash commands).
 * Application commands include global commands and guild-specific commands.
 * 
 * @example
 * import { Client } from 'double';
 * const client = new Client({ token });
 * await client.connect();
 * 
 * // Get global application commands
 * const commands = await client.applicationCommands.getGlobalCommands();
 * 
 * // Create a new slash command
 * const command = await client.applicationCommands.createGlobalCommand({
 *   name: 'ping',
 *   description: 'Ping the bot',
 *   type: 1
 * });
 */

export class ApplicationCommandEndpoints {
  constructor(rest) {
    this.rest = rest;
  }

  /**
   * Gets all global application commands.
   * 
   * @param {Object} [options] - Optional parameters
   * @param {boolean} [options.with_localizations] - Whether to include localization data
   * @returns {Promise<Array>} Array of application command objects
   * 
   * @example
   * const commands = await applicationCommands.getGlobalCommands();
   * commands.forEach(cmd => {
   *   console.log(`/${cmd.name}: ${cmd.description}`);
   * });
   */
  async getGlobalCommands(options = {}) {
    const params = new URLSearchParams();
    if (options.with_localizations) params.append('with_localizations', 'true');
    
    return this.rest.get(`/applications/${this.rest.applicationId}/commands?${params}`);
  }

  /**
   * Creates a new global application command.
   * Creating or updating a global command can take up to an hour to propagate.
   * 
   * @param {Object} data - Command data
   * @param {string} data.name - The command name (1-32 characters, lowercase)
   * @param {string} data.description - The command description (1-100 characters, for chat input)
   * @param {number} data.type - The command type (1=chat input, 2=user, 3=message)
   * @param {Array<Object>} [data.options] - Command options
   * @param {string} [data.default_member_permissions] - Default permission bit flags
   * @param {boolean} [data.dm_permission] - Whether command can be used in DMs
   * @param {string} [data.nsfw] - Whether command is age-restricted
   * @returns {Promise<Object>} The created command object
   * 
   * @example
   * const command = await applicationCommands.createGlobalCommand({
   *   name: 'hello',
   *   description: 'Say hello',
   *   type: 1,
   *   options: [{
   *     name: 'user',
   *     description: 'User to say hello to',
   *     type: 6,
   *     required: true
   *   }]
   * });
   */
  async createGlobalCommand(data) {
    return this.rest.post(`/applications/${this.rest.applicationId}/commands`, { body: data });
  }

  /**
   * Gets a specific global application command.
   * 
   * @param {string} commandId - The command ID
   * @returns {Promise<Object>} The command object
   * 
   * @example
   * const command = await applicationCommands.getGlobalCommand('command_id');
   */
  async getGlobalCommand(commandId) {
    return this.rest.get(`/applications/${this.rest.applicationId}/commands/${commandId}`);
  }

  /**
   * Edits a global application command.
   * Updates to global commands can take up to an hour to propagate.
   * 
   * @param {string} commandId - The command ID
   * @param {Object} data - Command modification data
   * @returns {Promise<Object>} The modified command object
   * 
   * @example
   * const command = await applicationCommands.editGlobalCommand('command_id', {
   *   description: 'Updated description'
   * });
   */
  async editGlobalCommand(commandId, data) {
    return this.rest.patch(`/applications/${this.rest.applicationId}/commands/${commandId}`, { body: data });
  }

  /**
   * Deletes a global application command.
   * 
   * @param {string} commandId - The command ID
   * @returns {Promise<Object>} Empty object on success
   * 
   * @example
   * await applicationCommands.deleteGlobalCommand('command_id');
   */
  async deleteGlobalCommand(commandId) {
    return this.rest.delete(`/applications/${this.rest.applicationId}/commands/${commandId}`);
  }

  /**
   * Bulk overwrites global application commands.
   * This replaces all existing global commands with the provided array.
   * Updates can take up to an hour to propagate.
   * 
   * @param {Array<Object>} commands - Array of command objects
   * @returns {Promise<Array>} Array of created command objects
   * 
   * @example
   * const commands = await applicationCommands.bulkOverwriteGlobalCommands([
   *   { name: 'ping', description: 'Ping', type: 1 },
   *   { name: 'help', description: 'Help', type: 1 }
   * ]);
   */
  async bulkOverwriteGlobalCommands(commands) {
    return this.rest.put(`/applications/${this.rest.applicationId}/commands`, { body: commands });
  }

  /**
   * Gets all application commands for a guild.
   * 
   * @param {string} guildId - The guild ID
   * @returns {Promise<Array>} Array of application command objects
   * 
   * @example
   * const commands = await applicationCommands.getGuildCommands('123456789');
   */
  async getGuildCommands(guildId) {
    return this.rest.get(`/applications/${this.rest.applicationId}/guilds/${guildId}/commands`);
  }

  /**
   * Creates a new guild application command.
   * Guild commands update instantly.
   * 
   * @param {string} guildId - The guild ID
   * @param {Object} data - Command data
   * @returns {Promise<Object>} The created command object
   * 
   * @example
   * const command = await applicationCommands.createGuildCommand('123456789', {
   *   name: 'moderate',
   *   description: 'Moderation commands',
   *   type: 1
   * });
   */
  async createGuildCommand(guildId, data) {
    return this.rest.post(`/applications/${this.rest.applicationId}/guilds/${guildId}/commands`, { body: data });
  }

  /**
   * Gets a specific guild application command.
   * 
   * @param {string} guildId - The guild ID
   * @param {string} commandId - The command ID
   * @returns {Promise<Object>} The command object
   * 
   * @example
   * const command = await applicationCommands.getGuildCommand('123456789', 'command_id');
   */
  async getGuildCommand(guildId, commandId) {
    return this.rest.get(`/applications/${this.rest.applicationId}/guilds/${guildId}/commands/${commandId}`);
  }

  /**
   * Edits a guild application command.
   * Guild commands update instantly.
   * 
   * @param {string} guildId - The guild ID
   * @param {string} commandId - The command ID
   * @param {Object} data - Command modification data
   * @returns {Promise<Object>} The modified command object
   * 
   * @example
   * const command = await applicationCommands.editGuildCommand('123456789', 'command_id', {
   *   description: 'Updated description'
   * });
   */
  async editGuildCommand(guildId, commandId, data) {
    return this.rest.patch(`/applications/${this.rest.applicationId}/guilds/${guildId}/commands/${commandId}`, { body: data });
  }

  /**
   * Deletes a guild application command.
   * 
   * @param {string} guildId - The guild ID
   * @param {string} commandId - The command ID
   * @returns {Promise<Object>} Empty object on success
   * 
   * @example
   * await applicationCommands.deleteGuildCommand('123456789', 'command_id');
   */
  async deleteGuildCommand(guildId, commandId) {
    return this.rest.delete(`/applications/${this.rest.applicationId}/guilds/${guildId}/commands/${commandId}`);
  }

  /**
   * Bulk overwrites guild application commands.
   * This replaces all existing guild commands with the provided array.
   * 
   * @param {string} guildId - The guild ID
   * @param {Array<Object>} commands - Array of command objects
   * @returns {Promise<Array>} Array of created command objects
   * 
   * @example
   * const commands = await applicationCommands.bulkOverwriteGuildCommands('123456789', [
   *   { name: 'ban', description: 'Ban a user', type: 1 },
   *   { name: 'kick', description: 'Kick a user', type: 1 }
   * ]);
   */
  async bulkOverwriteGuildCommands(guildId, commands) {
    return this.rest.put(`/applications/${this.rest.applicationId}/guilds/${guildId}/commands`, { body: commands });
  }

  /**
   * Gets guild application command permissions.
   * 
   * @param {string} guildId - The guild ID
   * @returns {Promise<Array>} Array of permission objects
   * 
   * @example
   * const permissions = await applicationCommands.getGuildCommandPermissions('123456789');
   */
  async getGuildCommandPermissions(guildId) {
    return this.rest.get(`/applications/${this.rest.applicationId}/guilds/${guildId}/commands/permissions`);
  }

  /**
   * Gets permissions for a specific guild application command.
   * 
   * @param {string} guildId - The guild ID
   * @param {string} commandId - The command ID
   * @returns {Promise<Object>} The command permissions object
   * 
   * @example
   * const permissions = await applicationCommands.getCommandPermissions('123456789', 'command_id');
   */
  async getCommandPermissions(guildId, commandId) {
    return this.rest.get(`/applications/${this.rest.applicationId}/guilds/${guildId}/commands/${commandId}/permissions`);
  }

  /**
   * Edits guild application command permissions.
   * 
   * @param {string} guildId - The guild ID
   * @param {string} commandId - The command ID
   * @param {Array<Object>} permissions - Array of permission objects
   * @returns {Promise<Object>} The updated permissions object
   * 
   * @example
   * const permissions = await applicationCommands.editCommandPermissions('123456789', 'command_id', [
   *   { id: 'role_id', type: 1, permission: true }
   * ]);
   */
  async editCommandPermissions(guildId, commandId, permissions) {
    return this.rest.put(`/applications/${this.rest.applicationId}/guilds/${guildId}/commands/${commandId}/permissions`, { body: permissions });
  }

  /**
   * Batch edits permissions for all guild application commands.
   * 
   * @param {string} guildId - The guild ID
   * @param {Array<Object>} permissions - Array of permission objects
   * @returns {Promise<Object>} Empty object on success
   * 
   * @example
   * await applicationCommands.batchEditCommandPermissions('123456789', [
   *   { id: 'command_id', permissions: [{ id: 'role_id', type: 1, permission: true }] }
   * ]);
   */
  async batchEditCommandPermissions(guildId, permissions) {
    return this.rest.put(`/applications/${this.rest.applicationId}/guilds/${guildId}/commands/permissions`, { body: permissions });
  }
}
