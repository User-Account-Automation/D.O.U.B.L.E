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

    // Update your status
    await client.account.setStatus({
      status: 'online',
      custom_status: {
        text: 'Automated with D.O.U.B.L.E'
      }
    });
    console.log('Status updated');

    // Get connections
    const connections = await client.account.getConnections();
    console.log(`Connected accounts: ${connections.length}`);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.disconnect();
  }
}

main();
