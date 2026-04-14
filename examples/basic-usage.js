import { Client } from '../src/index.js';

async function main() {
  const client = new Client({
    token: process.env.DISCORD_TOKEN,
    safety: 'strict'
  });

  try {
    console.log('Connecting to Discord...');
    await client.connect();
    console.log('Connected successfully');

    // Get your profile
    const profile = await client.account.getProfile();
    console.log('Profile:', profile.username);

    // Get your guilds
    const guilds = await client.account.getGuilds();
    console.log(`You are in ${guilds.length} guilds`);

    // Get your friends
    const friends = await client.relationships.getFriends();
    console.log(`You have ${friends.length} friends`);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.disconnect();
    console.log('Disconnected');
  }
}

main();
