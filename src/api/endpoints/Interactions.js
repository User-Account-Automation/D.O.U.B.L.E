export class InteractionEndpoints {
  constructor(rest) {
    this.rest = rest;
  }

  async createInteractionResponse(interactionId, interactionToken, data) {
    return this.rest.post(`/interactions/${interactionId}/${interactionToken}/callback`, {
      body: data
    });
  }

  async getOriginalInteractionResponse(applicationId, interactionToken) {
    return this.rest.get(`/webhooks/${applicationId}/${interactionToken}/messages/@original`);
  }

  async editOriginalInteractionResponse(applicationId, interactionToken, data) {
    return this.rest.patch(`/webhooks/${applicationId}/${interactionToken}/messages/@original`, {
      body: data
    });
  }

  async deleteOriginalInteractionResponse(applicationId, interactionToken) {
    return this.rest.delete(`/webhooks/${applicationId}/${interactionToken}/messages/@original`);
  }

  async createFollowupMessage(applicationId, interactionToken, data) {
    return this.rest.post(`/webhooks/${applicationId}/${interactionToken}`, {
      body: data
    });
  }

  async getFollowupMessage(applicationId, interactionToken, messageId) {
    return this.rest.get(`/webhooks/${applicationId}/${interactionToken}/messages/${messageId}`);
  }

  async editFollowupMessage(applicationId, interactionToken, messageId, data) {
    return this.rest.patch(`/webhooks/${applicationId}/${interactionToken}/messages/${messageId}`, {
      body: data
    });
  }

  async deleteFollowupMessage(applicationId, interactionToken, messageId) {
    return this.rest.delete(`/webhooks/${applicationId}/${interactionToken}/messages/${messageId}`);
  }
}
