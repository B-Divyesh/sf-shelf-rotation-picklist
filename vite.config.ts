import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const rootDirectory = fileURLToPath(new URL('.', import.meta.url));

function commitId(): string {
  try {
    return execFileSync('git', ['rev-parse', '--short=8', 'HEAD'], { encoding: 'utf8' }).trim();
  } catch {
    return '1.0.0-local';
  }
}

export default defineConfig(({ command }) => ({
  define: {
    'import.meta.env.VITE_BUILD_ID': JSON.stringify(command === 'build' ? commitId() : '1.0.0-local'),
  },
  build: {
    target: 'es2022',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(rootDirectory, 'index.html'),
        notFound: resolve(rootDirectory, '404.html'),
      },
    },
  },
  plugins: [{
    name: 'real-preview-404',
    configurePreviewServer(server) {
      server.middlewares.use((request, response, next) => {
        if (!request.url) return next();
        const pathname = new URL(request.url, 'http://localhost').pathname.replace(/\/$/, '') || '/';
        const appRoutes = new Set(['/', '/demo', '/privacy', '/terms']);
        if (appRoutes.has(pathname) || pathname.includes('.')) return next();
        response.statusCode = 404;
        response.setHeader('Content-Type', 'text/html; charset=utf-8');
        response.end(readFileSync(resolve(rootDirectory, 'dist/404.html')));
      });
    },
  }],
  test: {
    include: ['src/**/*.test.ts'],
  },
}));
