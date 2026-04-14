import { Client } from '../src/index.js';

async function strictMode() {
  const client = new Client({
    token: process.env.DISCORD_TOKEN,
    safety: 'strict',
    emergencyStop: true,
    humanEmulation: true,
    logLevel: 'info'
  });

  try {
    await client.connect();
    console.log('Connected in strict mode');

    const assessment = client.safetyManager.assessRisk('sendMessage', {
      content: 'test message'
    });
    console.log('Risk assessment:', assessment);

  } catch (error) {
    console.error('Strict mode error:', error.message);
  } finally {
    await client.disconnect();
  }
}

async function moderateMode() {
  const client = new Client({
    token: process.env.DISCORD_TOKEN,
    safety: 'moderate',
    humanEmulation: true,
    logLevel: 'info'
  });

  try {
    await client.connect();
    console.log('Connected in moderate mode');

    const assessment = client.safetyManager.assessRisk('sendMessage', {
      content: 'test message'
    });
    console.log('Risk assessment:', assessment);

  } catch (error) {
    console.error('Moderate mode error:', error.message);
  } finally {
    await client.disconnect();
  }
}

async function permissiveMode() {
  const client = new Client({
    token: process.env.DISCORD_TOKEN,
    safety: 'permissive',
    humanEmulation: false,
    logLevel: 'info'
  });

  try {
    await client.connect();
    console.log('Connected in permissive mode');

    const assessment = client.safetyManager.assessRisk('sendMessage', {
      content: 'test message'
    });
    console.log('Risk assessment:', assessment);

  } catch (error) {
    console.error('Permissive mode error:', error.message);
  } finally {
    await client.disconnect();
  }
}

async function main() {
  console.log('Testing different safety levels...\n');

  await strictMode();
  console.log('\n');
  await moderateMode();
  console.log('\n');
  await permissiveMode();
}

main();
