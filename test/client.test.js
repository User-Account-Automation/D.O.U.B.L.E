import { Client } from '../src/index.js';
import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('Client', () => {
  it('should throw error when token is not provided', () => {
    assert.throws(() => {
      new Client();
    }, /Token is required/);
  });

  it('should accept token from parameter', () => {
    const client = new Client({
      token: 'test_token'
    });
    assert.strictEqual(client.tokenManager.getToken(), 'test_token');
  });

  it('should have default safety options', () => {
    const client = new Client({
      token: 'test_token'
    });
    assert.strictEqual(client.options.safety, 'strict');
    assert.strictEqual(client.options.humanEmulation, true);
  });

  it('should allow custom safety options', () => {
    const client = new Client({
      token: 'test_token',
      safety: 'moderate',
      humanEmulation: false
    });
    assert.strictEqual(client.options.safety, 'moderate');
    assert.strictEqual(client.options.humanEmulation, false);
  });
});
