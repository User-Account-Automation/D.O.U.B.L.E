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
    console.log(`Found ${guilds.length} guilds`);

    if (guilds.length > 0) {
      const channels = await client.channels.getChannels(guilds[0].id);
      console.log(`Found ${channels.length} channels in ${guilds[0].name}`);

      const textChannel = channels.find(ch => ch.type === 0);
      if (textChannel) {
        await client.channels.sendMessage(textChannel.id, {
          content: 'Automated message from D.O.U.B.L.E'
        });
        console.log('Message sent');
      }
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.disconnect();
  }
}

main();
