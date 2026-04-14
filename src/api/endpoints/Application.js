/**
 * Application Endpoints
 * 
 * Provides methods for managing Discord applications.
 * This includes getting application information and managing application details.
 * 
 * @example
 * import { Client } from 'double';
 * const client = new Client({ token });
 * await client.connect();
 * 
 * // Get current application
 * const app = await client.applications.getCurrent();
 * console.log(`Application: ${app.name}`);
 */

export class ApplicationEndpoints {
  constructor(rest) {
    this.rest = rest;
  }

  /**
   * Gets the current application by application ID.
   * 
   * @param {string} applicationId - The application ID
   * @returns {Promise<Object>} The application object
   * 
   * @example
   * const app = await applications.get('application_id');
   * console.log(`Name: ${app.name}`);
   */
  async get(applicationId) {
    return this.rest.get(`/applications/${applicationId}`);
  }

  /**
   * Gets the current application information.
   * Uses the application ID from the REST client.
   * 
   * @returns {Promise<Object>} The application object
   * 
   * @example
   * const app = await applications.getCurrent();
   * console.log(`Name: ${app.name}`);
   */
  async getCurrent() {
    if (!this.rest.applicationId) {
      throw new Error('Application ID not set. Connect to the gateway first.');
    }
    return this.rest.get(`/applications/${this.rest.applicationId}`);
  }

  /**
   * Modifies the current application.
   * 
   * @param {Object} data - Application modification data
   * @param {string} [data.name] - Application name
   * @param {string} [data.description] - Application description
   * @param {string} [data.icon] - Base64 encoded icon
   * @returns {Promise<Object>} The modified application object
   * 
   * @example
   * const app = await applications.modify({
   *   name: 'Updated App Name'
   * });
   */
  async modify(data) {
    if (!this.rest.applicationId) {
      throw new Error('Application ID not set. Connect to the gateway first.');
    }
    return this.rest.patch(`/applications/${this.rest.applicationId}`, { body: data });
  }

  /**
   * Gets the application's RPC (Rich Presence) application info.
   * 
   * @param {string} applicationId - The application ID
   * @returns {Promise<Object>} The RPC application object
   * 
   * @example
   * const rpc = await applications.getRPC('application_id');
   */
  async getRPC(applicationId) {
    return this.rest.get(`/applications/${applicationId}/rpc`);
  }

  /**
   * Gets application assets (icons, cover images, etc.).
   * 
   * @param {string} applicationId - The application ID
   * @returns {Promise<Object>} The application assets object
   * 
   * @example
   * const assets = await applications.getAssets('application_id');
   */
  async getAssets(applicationId) {
    return this.rest.get(`/applications/${applicationId}/assets`);
  }

  /**
   * Gets all applications for the current user.
   * 
   * @returns {Promise<Array>} Array of application objects
   * 
   * @example
   * const applications = await applications.getApplications();
   */
  async getApplications() {
    return this.rest.get('/users/@me/applications');
  }
}
