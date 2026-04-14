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

    const guilds = await client.users.getCurrentUserGuilds();
    console.log(`You are in ${guilds.length} guilds`);

    for (const guild of guilds) {
      console.log(`- ${guild.name} (ID: ${guild.id})`);
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.disconnect();
  }
}

main();
