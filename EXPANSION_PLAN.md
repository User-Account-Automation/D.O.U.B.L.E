# D.O.U.B.L.E API Wrapper Expansion Plan

## Current State Assessment

### Existing Endpoints (17 files)
- Channels.js - Basic channel operations, messages, reactions
- Users.js - Basic user operations
- Voice.js - Join/leave voice channels
- Webhooks.js - Basic webhook operations
- Interactions.js - Basic interaction responses
- Emojis.js - Basic emoji operations
- Stickers.js - Basic sticker operations
- Threads.js - Basic thread operations

### Critical Missing Endpoints

#### Guild Management (CRITICAL)
- Get guild
- Modify guild
- Delete guild
- Get guild channels
- Create guild channel
- Modify guild positions
- Get guild roles
- Create guild role
- Modify guild role positions
- Modify guild role
- Delete guild role
- Get guild bans
- Create guild ban
- Remove guild ban
- Get guild members
- Get guild member
- Modify guild member
- Modify current member
- Add guild member
- Remove guild member
- Get guild prune count
- Begin guild prune
- Get guild voice regions
- Get guild invites
- Create guild invite
- Delete guild invite
- Get guild integrations
- Get guild widget settings
- Modify guild widget
- Get guild widget
- Get guild vanity URL
- Get guild widget image
- Get guild welcome screen
- Modify guild welcome screen
- Get guild scheduled events
- Create guild scheduled event
- Modify guild scheduled event
- Delete guild scheduled event
- Get guild scheduled event users
- Get guild templates
- Create guild template
- Sync guild template
- Modify guild template
- Delete guild template
- Get all auto moderation rules
- Get auto moderation rule
- Create auto moderation rule
- Modify auto moderation rule
- Delete auto moderation rule

#### Message Operations (EXPANSION NEEDED)
- Get channel messages (pagination, filtering)
- Get message
- Create message (with attachments, embeds, components)
- Edit message
- Delete message
- Bulk delete messages
- Get pinned messages
- Pin message
- Unpin message
- Crosspost message
- Add reaction
- Remove reaction
- Get reactions
- Clear reactions
- Remove all reactions
- Remove all reactions for emoji

#### Channel Operations (EXPANSION NEEDED)
- Get channel
- Modify channel
- Delete channel
- Get channel messages
- Create message
- Get invites
- Create invite
- Delete invite
- Get permission overwrites
- Create permission overwrite
- Modify permission overwrite
- Delete permission overwrite
- Follow announcement channel
- Trigger typing indicator
- Get pinned messages
- Group DM operations

#### Role Management (MISSING)
- Get guild roles
- Create guild role
- Modify guild role
- Modify guild role positions
- Delete guild role

#### Member Management (MISSING)
- Get guild members
- Get guild member
- Modify guild member
- Modify current member
- Add guild member
- Remove guild member
- Get guild prune count
- Begin guild prune

#### Invite Management (MISSING)
- Get channel invites
- Get guild invites
- Create invite
- Delete invite
- Get invite
- Accept invite
- Delete invite

#### Audit Logs (CRITICAL FOR SELFBOTS)
- Get guild audit log

#### Ban Management (MISSING)
- Get guild bans
- Get guild ban
- Create guild ban
- Remove guild ban

#### Permission Management (MISSING)
- Get permission overwrites
- Create permission overwrite
- Modify permission overwrite
- Delete permission overwrite

#### Application Commands (MISSING)
- Get global application commands
- Create global application command
- Get global application command
- Edit global application command
- Delete global application command
- Bulk overwrite global application commands
- Get guild application commands
- Create guild application command
- Get guild application command
- Edit guild application command
- Delete guild application command
- Bulk overwrite guild application commands
- Get guild application command permissions
- Edit guild application command permissions
- Batch edit guild application command permissions

#### Stage Channels (MISSING)
- Get stage instance
- Create stage instance
- Edit stage instance
- Delete stage instance

#### Guild Onboarding (MISSING)
- Get guild onboarding
- Modify guild onboarding

#### Soundboard (MISSING)
- Get soundboard sounds
- Create soundboard sound
- Edit soundboard sound
- Delete soundboard sound

#### Polls (MISSING)
- Get poll answer voters
- End poll

## Implementation Priority

### Phase 1: Critical Selfbot Features (Week 1)
1. Guild endpoints (Guilds.js) - Complete guild management
2. Role endpoints (Roles.js) - Role management
3. Member endpoints (Members.js) - Member management
4. Invite endpoints (Invites.js) - Invite management
5. Audit Log endpoints (AuditLogs.js) - Critical for monitoring

### Phase 2: Core Message Operations (Week 2)
1. Expand Channels.js with all channel types
2. Complete message operations with attachments, embeds, components
3. Add permission management
4. Add ban management

### Phase 3: Advanced Features (Week 3)
1. Application Commands (slash commands)
2. Stage channels
3. Guild scheduled events
4. Guild templates
5. Welcome screens

### Phase 4: Modern Discord Features (Week 4)
1. Auto moderation
2. Guild onboarding
3. Soundboard
4. Polls
5. Advanced voice features

### Phase 5: Documentation & Polish (Week 5)
1. Comprehensive JSDoc comments for all methods
2. Type definitions
3. Usage examples
4. API documentation
5. Error handling improvements

## Code Quality Standards

### Comment Style
- Use natural, human-like comments
- Explain why, not just what
- Include usage examples in comments
- Document edge cases and limitations
- Reference Discord API documentation where relevant

### Example Comment Style
```javascript
/**
 * Creates a new role in the guild.
 * 
 * @param {string} guildId - The guild ID
 * @param {Object} data - Role data
 * @param {string} [data.name] - The name of the role
 * @param {number} [data.permissions] - Permission bit flags
 * @param {number} [data.color] - RGB color value
 * @param {boolean} [data.hoist] - Whether the role is displayed separately
 * @param {boolean} [data.mentionable] - Whether the role can be mentioned
 * @returns {Promise<Object>} The created role object
 * 
 * @example
 * const role = await guilds.createRole(guildId, {
 *   name: 'Moderator',
 *   permissions: 8,
 *   color: 0xff0000,
 *   hoist: true,
 *   mentionable: false
 * });
 */
async createRole(guildId, data) {
  // Implementation
}
```

## File Structure After Expansion

```
src/
├── api/
│   ├── Gateway.js
│   ├── REST.js
│   └── endpoints/
│       ├── Account.js (rename from Users.js)
│       ├── Channels.js (expanded)
│       ├── Guilds.js (new)
│       ├── Roles.js (new)
│       ├── Members.js (new)
│       ├── Invites.js (new)
│       ├── AuditLogs.js (new)
│       ├── Bans.js (new)
│       ├── Permissions.js (new)
│       ├── Messages.js (extract from Channels.js)
│       ├── Reactions.js (extract from Channels.js)
│       ├── Voice.js (expanded)
│       ├── Webhooks.js (expanded)
│       ├── Interactions.js (expanded)
│       ├── Emojis.js (expanded)
│       ├── Stickers.js (expanded)
│       ├── Threads.js (expanded)
│       ├── ApplicationCommands.js (new)
│       ├── StageChannels.js (new)
│       ├── ScheduledEvents.js (new)
│       ├── Templates.js (new)
│       ├── AutoModeration.js (new)
│       ├── Onboarding.js (new)
│       ├── Soundboard.js (new)
│       └── Polls.js (new)
├── client/
│   └── Client.js (expanded to expose all endpoints)
├── security/
│   ├── TokenManager.js
│   └── SafetyManager.js
├── utils/
│   ├── Logger.js
│   ├── RateLimiter.js
│   ├── Errors.js
│   ├── Permissions.js (new)
│   └── Helpers.js (new)
└── index.js (expanded exports)
```

## Success Metrics

- Coverage: 90%+ of Discord REST API endpoints
- Documentation: 100% of methods have JSDoc comments
- Type Safety: TypeScript definitions for all exports
- Examples: Usage examples for all major operations
- Error Handling: Comprehensive error handling with clear messages
