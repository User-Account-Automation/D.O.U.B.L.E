/**
 * Billing Endpoints
 * 
 * Provides methods for managing Discord billing information.
 * This includes payment sources, subscriptions, and billing history.
 * 
 * @example
 * import { Client } from 'double';
 * const client = new Client({ token });
 * await client.connect();
 * 
 * // Get payment sources
 * const sources = await client.billing.getPaymentSources();
 * 
 * // Get subscriptions
 * const subscriptions = await client.billing.getSubscriptions();
 */

export class BillingEndpoints {
  constructor(rest) {
    this.rest = rest;
  }

  /**
   * Gets the user's payment sources.
   * 
   * @returns {Promise<Array>} Array of payment source objects
   * 
   * @example
   * const sources = await billing.getPaymentSources();
   * sources.forEach(source => {
   *   console.log(`Type: ${source.type}`);
   * });
   */
  async getPaymentSources() {
    return this.rest.get('/users/@me/billing/payment-sources');
  }

  /**
   * Gets the user's subscriptions.
   * 
   * @returns {Promise<Array>} Array of subscription objects
   * 
   * @example
   * const subscriptions = await billing.getSubscriptions();
   * subscriptions.forEach(sub => {
   *   console.log(`Plan: ${sub.plan.name}`);
   * });
   */
  async getSubscriptions() {
    return this.rest.get('/users/@me/billing/subscriptions');
  }

  /**
   * Gets the user's payment history.
   * 
   * @returns {Promise<Array>} Array of payment history objects
   * 
   * @example
   * const history = await billing.getPaymentHistory();
   * history.forEach(entry => {
   *   console.log(`Amount: ${entry.amount}`);
   * });
   */
  async getPaymentHistory() {
    return this.rest.get('/users/@me/billing/payments');
  }

  /**
   * Gets the user's premium subscription status.
   * 
   * @returns {Promise<Object>} The premium subscription object
   * 
   * @example
   * const premium = await billing.getPremiumSubscription();
   * console.log(`Premium: ${premium.premium_type}`);
   */
  async getPremiumSubscription() {
    return this.rest.get('/users/@me/billing/premium-subscription');
  }
}
