import { expect, test, describe, afterEach } from '@rstest/core';
import { apiClient, api } from '../../../src/services/api/client';

describe('API Client', () => {
  afterEach(() => {
    // Cleanup if needed
  });

  test('apiClient is defined', () => {
    expect(apiClient).toBeDefined();
  });

  test('api object is defined', () => {
    expect(api).toBeDefined();
  });

  test('apiClient has HTTP methods', () => {
    expect(typeof apiClient.get).toBe('function');
    expect(typeof apiClient.post).toBe('function');
    expect(typeof apiClient.put).toBe('function');
    expect(typeof apiClient.patch).toBe('function');
    expect(typeof apiClient.delete).toBe('function');
  });

  test('api object has HTTP methods', () => {
    expect(typeof api.get).toBe('function');
    expect(typeof api.post).toBe('function');
    expect(typeof api.put).toBe('function');
    expect(typeof api.patch).toBe('function');
    expect(typeof api.delete).toBe('function');
  });

  test('api methods return promises', () => {
    expect(api.get('/test')).toBeInstanceOf(Promise);
    expect(api.post('/test', {})).toBeInstanceOf(Promise);
    expect(api.put('/test', {})).toBeInstanceOf(Promise);
    expect(api.patch('/test', {})).toBeInstanceOf(Promise);
    expect(api.delete('/test')).toBeInstanceOf(Promise);
  });
});
