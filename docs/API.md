# D.O.U.B.L.E API Documentation

## Overview

D.O.U.B.L.E is a JavaScript wrapper for Discord's user account API. It handles the boring stuff like rate limiting and adds some safety features to help keep your account from getting banned.

## Installation

```bash
npm install @uaa/double
```

## Quick Start

```javascript
import { Client } from '@uaa/double';

const client = new Client({
  token: process.env.DISCORD_TOKEN,
  safety: 'strict'
});

await client.connect();
```

## Client Options

```javascript
{
  token: string,           // Your Discord user token
  safety: 'strict' | 'moderate' | 'permissive',
  rateLimitMode: 'conservative' | 'balanced' | 'aggressive',
  autoCooldown: boolean,    // Auto cooldowns between actions
  humanEmulation: boolean, // Add delays to look human
  auditLogging: boolean,   // Log everything you do
  riskWarnings: boolean,   // Warn about risky stuff
  emergencyStop: boolean,  // Stop if something's too risky
  logLevel: 'error' | 'warn' | 'info' | 'debug'
}
```

## Core Classes

### Client

The main class you use to connect to Discord.

#### Methods

- `connect()` - Connect to Discord
- `disconnect()` - Disconnect from Discord
- `account` - Account stuff
- `relationships` - Friends and blocks
- `guilds` - Server operations
- `applications` - App management
- `billing` - Payment stuff
- `channels` - Channel operations
- `users` - User operations
- `voice` - Voice chat
- `webhooks` - Webhook stuff
- `interactions` - Slash commands and buttons
- `emojis` - Emoji management
- `stickers` - Sticker stuff
- `threads` - Thread operations

### TokenManager

Handles your Discord token and makes sure it's secure.

#### Methods

- `getToken()` - Get your token
- `validateToken(token)` - Check if token looks right
- `rotateToken(newToken)` - Swap to a new token
- `maskToken()` - Get a masked version for logs
- `getTokenSource()` - See where the token came from

### RateLimiter

Rate limiting that tries to act like a real person.

#### Methods

- `waitBeforeRequest(endpoint, method)` - Wait before making a request
- `getStats()` - See how many requests you've made
- `reset()` - Clear everything

### SafetyManager

Checks if actions are risky and blocks dangerous stuff.

#### Methods

- `assessRisk(action, details)` - Check how risky an action is
- `logAction(action, details)` - Log what you did
- `getAuditLog(limit)` - See your recent actions
- `getRiskScore()` - Get your current risk level
- `reset()` - Clear the logs

### Logger

Logging that hides sensitive data like tokens.

#### Methods

- `error(message, meta)` - Log errors
- `warn(message, meta)` - Log warnings
- `info(message, meta)` - Log info
- `debug(message, meta)` - Log debug stuff
- `maskSensitiveData(data)` - Hide sensitive stuff

## API Endpoints

### Account Endpoints

- `getProfile()` - Get your profile
- `setProfile(data)` - Update your profile
- `setStatus(data)` - Change your status
- `getConnections()` - Get connected accounts
- `getGuilds()` - Get your servers

### Relationship Endpoints

- `getFriends()` - Get your friends list
- `sendFriendRequest(userId)` - Send a friend request
- `acceptFriendRequest(userId)` - Accept a friend request
- `blockUser(userId)` - Block someone
- `unblockUser(userId)` - Unblock someone

### Guild Endpoints

- `getGuild(guildId)` - Get server info
- `leaveGuild(guildId)` - Leave a server
- `joinGuild(inviteCode)` - Join a server
- `getChannels(guildId)` - Get server channels

### Channel Endpoints

- `getChannel(channelId)` - Get channel info
- `modifyChannel(channelId, data)` - Change channel settings
- `deleteChannel(channelId)` - Delete a channel
- `getMessages(channelId, options)` - Get messages
- `sendMessage(channelId, data)` - Send a message
- `editMessage(channelId, messageId, data)` - Edit a message
- `deleteMessage(channelId, messageId)` - Delete a message
- `bulkDeleteMessages(channelId, messageIds)` - Delete lots of messages
- `addReaction(channelId, messageId, emoji)` - Add a reaction
- `removeReaction(channelId, messageId, emoji)` - Remove a reaction

### User Endpoints

- `getUser(userId)` - Get user info
- `getCurrentUser()` - Get your user info
- `modifyCurrentUser(data)` - Change your user info
- `getCurrentUserGuilds(options)` - Get your servers
- `leaveGuild(guildId)` - Leave a server
- `getUserDMs()` - Get your DMs
- `createDM(userId)` - Start a DM
- `getUserConnections()` - Get your connections
- `getUserSettings()` - Get your settings
- `modifyUserSettings(data)` - Change your settings

### Voice Endpoints

- `joinVoiceChannel(guildId, channelId, options)` - Join voice chat
- `leaveVoiceChannel(guildId)` - Leave voice chat
- `getVoiceRegions()` - Get voice server locations

### Application Endpoints

- `getApplications()` - Get your apps
- `createApplication(data)` - Make a new app
- `getOAuth2Tokens()` - Get OAuth tokens

### Billing Endpoints

- `getSubscriptions()` - Get your subscriptions
- `getPaymentSources()` - Get your payment methods

### Webhook Endpoints

- `getWebhook(webhookId, webhookToken)` - Get webhook info
- `createWebhook(channelId, data)` - Make a webhook
- `modifyWebhook(webhookId, data, webhookToken)` - Change webhook
- `deleteWebhook(webhookId, webhookToken)` - Delete webhook
- `executeWebhook(webhookId, webhookToken, data)` - Run webhook
- `executeSlackWebhook(webhookId, webhookToken, data)` - Run for Slack
- `executeGitHubWebhook(webhookId, webhookToken, data)` - Run for GitHub

### Interaction Endpoints

- `createInteractionResponse(interactionId, interactionToken, data)` - Respond to interaction
- `getOriginalInteractionResponse(applicationId, interactionToken)` - Get original response
- `editOriginalInteractionResponse(applicationId, interactionToken, data)` - Edit original response
- `deleteOriginalInteractionResponse(applicationId, interactionToken)` - Delete original response
- `createFollowupMessage(applicationId, interactionToken, data)` - Send followup
- `getFollowupMessage(applicationId, interactionToken, messageId)` - Get followup
- `editFollowupMessage(applicationId, interactionToken, messageId, data)` - Edit followup
- `deleteFollowupMessage(applicationId, interactionToken, messageId)` - Delete followup

### Emoji Endpoints

- `getGuildEmojis(guildId)` - Get server emojis
- `getGuildEmoji(guildId, emojiId)` - Get specific emoji
- `createGuildEmoji(guildId, data)` - Make an emoji
- `modifyGuildEmoji(guildId, emojiId, data)` - Change emoji
- `deleteGuildEmoji(guildId, emojiId)` - Delete emoji

### Sticker Endpoints

- `getSticker(stickerId)` - Get a sticker
- `getStickerPack(stickerPackId)` - Get a sticker pack
- `listStickerPacks()` - List all sticker packs
- `getGuildStickers(guildId)` - Get server stickers
- `getGuildSticker(guildId, stickerId)` - Get specific sticker
- `createGuildSticker(guildId, data)` - Make a sticker
- `modifyGuildSticker(guildId, stickerId, data)` - Change sticker
- `deleteGuildSticker(guildId, stickerId)` - Delete sticker

### Thread Endpoints

- `getThread(channelId)` - Get thread info
- `modifyThread(channelId, data)` - Change thread settings
- `deleteThread(channelId)` - Delete thread
- `joinThread(channelId)` - Join a thread
- `leaveThread(channelId)` - Leave a thread
- `addThreadMember(channelId, userId)` - Add someone to thread
- `removeThreadMember(channelId, userId)` - Remove from thread
- `getThreadMembers(channelId)` - Get thread members
- `getArchivedThreads(channelId, type, options)` - Get old threads
- `startThread(parentChannelId, data)` - Start a thread
- `startThreadInForum(channelId, data)` - Start thread in forum

## Safety Features

### Risk Assessment

Every action gets checked for risk before it runs:

- Action type risk (high/medium/low)
- Frequency risk (how often you do it)
- Content risk (spam patterns, links)
- Timing risk (time of day)
- Volume risk (bulk operations)

### Rate Limiting

Smart rate limiting with:

- Per-endpoint limits
- Global limits
- Human-like delays
- Automatic retries

### Emergency Stop

Actions with risk over 90% get blocked in strict mode.

## Error Handling

Errors get logged automatically:

```javascript
try {
  await client.channels.sendMessage(channelId, { content: 'test' });
} catch (error) {
  // Error is logged automatically
  console.error(error.message);
}
```

## Examples

Check the `examples/` folder for usage examples.
