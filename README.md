# D.O.U.B.L.E - JavaScript Discord Selfbot Library

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Node.js](https://img.shields.io/badge/node-18%2B-brightgreen.svg)
![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)

D.O.U.B.L.E (Discord Operations for User-Based Logic and Execution) is a comprehensive JavaScript wrapper for Discord's user account API. It is the most complete selfbot library for Node.js, providing full access to Discord user account features with built-in safety mechanisms, rate limiting, and anti-detection measures.

Unlike Python selfbot libraries, D.O.U.B.L.E is built specifically for the JavaScript/Node.js ecosystem, making it perfect for developers who prefer JavaScript or need to integrate Discord automation into existing Node.js projects.

WARNING: Using self-bots violates Discord's Terms of Service. Your account can be permanently banned. This is for educational purposes only. Use at your own risk.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [API Reference](#api-reference)
- [Comparison with Python Libraries](#comparison-with-python-libraries)
- [Safety Features](#safety-features)
- [License](#license)

## Features

### Complete API Coverage

D.O.U.B.L.E provides 21 endpoint classes covering all Discord user account features:

- Full access to guilds, channels, messages, friends, relationships, voice, webhooks
- Support for modern Discord features: Stage Channels, Soundboard, Polls, Auto Moderation
- Account management, guild operations, communication, voice and media
- Relationship management, applications and billing

### Built-in Safety Features

- Adaptive rate limiting that mimics human behavior
- Token security - prevents hardcoded tokens, enforces environment variables
- Safety checks before performing risky operations
- Audit logging for all actions
- Emergency stop functionality for immediate shutdown

### Modern JavaScript

- ES modules with full TypeScript compatibility
- Async/await throughout for clean, readable code
- Comprehensive JSDoc documentation with examples
- Node.js 18+ support with latest features

### Performance

- Optimized HTTP requests with connection pooling
- Efficient rate limiting without blocking
- Minimal dependencies for fast installation
- Lightweight footprint compared to Python alternatives

## Installation

```bash
# Clone the repository
git clone https://github.com/User-Account-Automation/D.O.U.B.L.E.git
cd D.O.U.B.L.E

# Install dependencies
npm install
```

## Quick Start

```javascript
import { Client } from './src/index.js';

const client = new Client({
  token: process.env.DISCORD_TOKEN,
  safety: 'strict'
});

await client.connect();

// Update your status
await client.account.setStatus({
  status: 'online',
  custom_status: { text: 'Automated with D.O.U.B.L.E' }
});

// Get your guilds
const guilds = await client.account.getGuilds();
console.log(`You're in ${guilds.length} guilds`);

// Send a message
await client.channels.createMessage('channel_id', {
  content: 'Hello from D.O.U.B.L.E!'
});
```

## Features

### Account Management

- Profile operations - Get and modify user profile
- Status management - Set online status and custom status
- Settings control - Modify account settings
- Guild access - List and manage guild memberships
- Connection management - View connected accounts

### Guild Operations

- Full guild API - Create, modify, delete guilds
- Channel management - All channel types (text, voice, category, etc.)
- Member operations - Kick, ban, mute, and manage members
- Role management - Create and modify roles
- Audit logs - View guild audit logs
- Invite management - Create and manage invites

### Communication

- Message operations - Send, edit, delete messages
- Thread support - Create and manage threads
- Emoji management - Add and modify emojis
- Sticker support - Work with stickers
- Webhook operations - Full webhook management

### Voice and Media

- Voice channels - Join and leave voice channels
- Stage channels - Manage stage instances
- Soundboard - Upload and manage soundboard sounds
- Voice regions - Get available voice regions

### Modern Discord Features

- Polls - Create and manage polls
- Auto Moderation - Configure auto moderation rules
- Guild Onboarding - Manage guild onboarding flows
- Application Commands - Slash command support

### Relationships

- Friend management - Add, remove, and manage friends
- Block and unblock - Block and unblock users
- Relationship status - View all relationships

### Applications and Billing

- Application management - Manage Discord applications
- OAuth2 tokens - View OAuth2 tokens
- Billing info - View subscriptions and payment methods

## 🔒 Safety Features

D.O.U.B.L.E includes comprehensive safety features to help reduce the risk of account bans:

### Token Security
- Environment variable enforcement - Tokens must be in DISCORD_TOKEN
- No hardcoding allowed - Prevents accidental token exposure
- Token validation - Validates token format before use

### Rate Limiting
- Adaptive rate limits - Adjusts based on usage patterns
- Human-like delays - Mimics human behavior between actions
- Global rate limiting - Prevents overall API abuse
- Endpoint-specific limits - Respects Discord's rate limits

### Safety Checks
- Risk assessment - Evaluates risk before actions
- Warning system - Alerts before dangerous operations
- Audit logging - Logs all actions for review
- Emergency stop - Immediate shutdown capability

## 📖 📖 Documentation

### Client Class
The main entry point for all operations.

```javascript
const client = new Client({
  token: process.env.DISCORD_TOKEN,
  safety: 'strict' // or 'medium', 'relaxed'
});

await client.connect();
```

### Available Endpoints

```javascript
// Account operations
await client.account.getProfile();
await client.account.setStatus({ status: 'online' });

// Guild operations
await client.guilds.getGuild('guild_id');
await client.guilds.createGuild({ name: 'My Server' });

// Channel operations
await client.channels.createMessage('channel_id', { content: 'Hello' });
await client.channels.modifyChannel('channel_id', { name: 'new-name' });

// Relationship operations
await client.relationships.getFriends();
await client.relationships.sendFriendRequest('username#1234');

// Voice operations
await client.voice.joinVoiceChannel('channel_id');
await client.voice.leaveVoiceChannel('channel_id');

// Webhook operations
await client.webhooks.createWebhook('channel_id', { name: 'My Webhook' });
```

## Comparison with Python Selfbot Libraries

| Feature | D.O.U.B.L.E (JS) | Python Libraries |
|---------|------------------|------------------|
| Language | JavaScript/Node.js | Python |
| Async Support | Native async/await | Requires asyncio |
| Type Safety | TypeScript ready | Requires type hints |
| Ecosystem | npm (1M+ packages) | PyPI (400K+ packages) |
| Performance | V8 optimized | CPython |
| Modern Syntax | ES2023+ | Python 3.10+ |
| Web Integration | Native (Node.js) | Requires Flask/Django |
| Real-time | Native WebSocket | Requires websockets |

Advantages of D.O.U.B.L.E:
- Better for web projects - Native integration with Express, Fastify, etc.
- Faster development - Modern JavaScript syntax and tooling
- Larger ecosystem - Access to npm's massive package library
- TypeScript support - Built-in type safety with IDE autocomplete
- Real-time applications - Native WebSocket support for live features

## 🛠️ API Reference

### Client Options

```typescript
interface ClientOptions {
  token: string;           // Discord user token
  safety?: 'strict' | 'medium' | 'relaxed';  // Safety level (default: 'strict')
}
```

### Safety Levels

- strict - Maximum safety, slowest operations
- medium - Balanced safety and speed
- relaxed - Minimal safety, fastest operations

## Disclaimer

Using self-bots violates Discord's Terms of Service. Your account can be permanently banned. This library is for educational purposes and personal use only.

- I am not responsible if you get banned
- Use at your own risk
- Respect Discord's ToS
- Don't abuse the API

## License

MIT License - you must give credit if you use this code.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Contact

Made by UAA (User Account Automation)

Keywords: discord selfbot, javascript selfbot, node.js discord automation, discord user account api, discord automation library, selfbot library js, discord bot alternative, user account automation, discord selfbot npm, discord selfbot github
