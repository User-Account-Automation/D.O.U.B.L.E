import { Client } from '../src/index.js';

async function main() {
  const client = new Client({
    token: process.env.DISCORD_TOKEN,
    safety: 'strict',
    humanEmulation: true,
    logLevel: 'debug'
  });

  try {
    await client.connect();
    console.log('Connected with strict safety mode');

    const assessment = client.safetyManager.assessRisk('sendMessage', {
      content: 'test message'
    });
    console.log('Risk assessment:', assessment);

    const auditLog = client.safetyManager.getAuditLog(10);
    console.log('Audit log entries:', auditLog.length);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.disconnect();
  }
}

main();
