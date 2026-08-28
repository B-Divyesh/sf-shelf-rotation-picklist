import { defineConfig } from '@playwright/test';

const externalBaseURL = process.env.PLAYWRIGHT_BASE_URL;

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  fullyParallel: false,
  use: {
    baseURL: externalBaseURL ?? 'http://127.0.0.1:4173',
    browserName: 'chromium',
    headless: true,
    reducedMotion: 'reduce',
  },
  webServer: externalBaseURL ? undefined : {
    command: 'npm run build && npm run preview -- --host 127.0.0.1',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: false,
  },
});
