import { defineConfig } from '@rstest/core';

export default defineConfig({
  testEnvironment: 'jsdom', // or 'happy-dom'
  reporters: [['junit', { outputPath: './junit.xml' }]],
});