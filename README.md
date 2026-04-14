# D.O.U.B.L.E

![D.O.U.B.L.E](D.O.U.B.L.E.png)

[![npm version](https://badge.fury.io/js/%40uaa%2Fdouble.svg)](https://www.npmjs.com/package/@uaa/double)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/node/v/@uaa/double.svg)](https://www.npmjs.com/package/@uaa/double)

> **⚠️ WARNING**: Using self-bots violates Discord's Terms of Service. Your account can be permanently banned. This is for educational purposes only. Use at your own risk. I'm not responsible if you get banned.

D.O.U.B.L.E (Discord Operations for User-Based Logic and Execution) is a JavaScript wrapper for Discord's user account API. I made this because I wanted to automate some things with my personal Discord account without dealing with the limitations and complexity of bot accounts.

It's basically discord.js but for user accounts instead of bots. It handles rate limiting, adds some safety features to help avoid getting banned, and gives you access to pretty much everything you can do with your own account through the API.

## Installing

```bash
npm install @uaa/double
```

## Getting Started

```javascript
import { Client } from '@uaa/double';

const client = new Client({
  token: process.env.DISCORD_TOKEN,
  safety: 'strict'
});

await client.connect();

// Do stuff with your account
await client.account.setProfile({
  status: 'online',
  customStatus: { text: 'Automated with D.O.U.B.L.E' }
});
```

## What It Does

- Full access to user account APIs (profile, friends, servers, etc.)
- Rate limiting that tries to look like a real person
- Token handling that won't let you hardcode tokens
- Safety checks before doing risky stuff
- Works with Node.js 18+

## Safety Stuff

I built in some protections because user account automation is risky:

- Forces you to use environment variables for tokens (no hardcoding)
- Rate limits that adapt based on how you're using it
- Automatic delays between similar actions
- Warnings when you're about to do something dangerous
- Logs everything so you can see what happened

## Important

Using self-bots breaks Discord's Terms of Service. This is for educational purposes and personal use. If you get banned, that's on you. Don't blame me.

## License

MIT - you need to give credit if you use this code.

## About

Made by UAA (User Account Automation)
