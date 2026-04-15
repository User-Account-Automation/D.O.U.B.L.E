import { TokenManager } from '../src/security/TokenManager.js';
import { SafetyManager } from '../src/security/SafetyManager.js';
import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('TokenManager', () => {
  it('should validate correct token format', async () => {
    const manager = new TokenManager();
    const validToken = 'eyJpZCI6IjEyMzQ1Njc4OTAxMjM0NTY3ODkwMTIzNDU2Nzg5MDEyMzQ1Njc4OTAifQ.eyJpZCI6IjEyMzQ1Njc4OTAifQ.eyJpZCI6IjEyMzQ1Njc4OTAifQ';
    await manager.validateToken(validToken);
  });

  it('should reject invalid token format', async () => {
    const manager = new TokenManager();
    const invalidToken = 'invalid_token';
    await assert.rejects(
      () => manager.validateToken(invalidToken),
      /Invalid token format/
    );
  });

  it('should mask token for logging', () => {
    const manager = new TokenManager('test_token_part.test_token_part.test_token_part');
    const masked = manager.maskToken();
    assert.ok(masked.includes('...'));
    assert.ok(!masked.includes('test_token_part'));
  });
});

describe('SafetyManager', () => {
  it('should assess risk for actions', () => {
    const manager = new SafetyManager({ safety: 'strict' });
    const assessment = manager.assessRisk('sendMessage', { content: 'test' });
    assert.ok(assessment.risk >= 0);
    assert.ok(assessment.risk <= 1);
  });

  it('should block high risk actions in strict mode', () => {
    const manager = new SafetyManager({ safety: 'strict', emergencyStop: true });
    const assessment = manager.assessRisk('massDelete', { count: 100 });
    assert.ok(!assessment.allowed);
  });

  it('should log actions', () => {
    const manager = new SafetyManager({ auditLogging: true });
    manager.logAction('testAction', { details: 'test' });
    const log = manager.getAuditLog(1);
    assert.strictEqual(log.length, 1);
    assert.strictEqual(log[0].action, 'testAction');
  });
});
