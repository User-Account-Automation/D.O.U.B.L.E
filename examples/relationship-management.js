import { Client } from '../src/index.js';

async function main() {
  const client = new Client({
    token: process.env.DISCORD_TOKEN,
    safety: 'strict',
    humanEmulation: true
  });

  try {
    await client.connect();
    console.log('Connected');

    const friends = await client.relationships.getFriends();
    console.log(`You have ${friends.length} friends`);

    const users = await client.users.getCurrentUser();
    console.log(`Your username: ${users.username}`);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.disconnect();
  }
}

main();
