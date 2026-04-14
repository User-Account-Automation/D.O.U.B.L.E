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

    const regions = await client.voice.getVoiceRegions();
    console.log(`Available voice regions: ${regions.length}`);
    regions.forEach(region => {
      console.log(`- ${region.name} (${region.id})`);
    });

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.disconnect();
  }
}

main();
