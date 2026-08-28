// @ts-nocheck -- Vitest runs this repository-and-build test under Node.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, rmSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('release documents', () => {
  it('@claim:docs-build runs the documented build and verifies its deployable output', () => {
    const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as { engines: { node: string }, scripts: { build: string } };
    expect(packageJson.engines.node).toBe('>=20');
    expect(packageJson.scripts.build).toContain('vite build');
    expect(readFileSync('LICENSE', 'utf8')).toContain('Permission is hereby granted');
    expect(existsSync('public/staticwebapp.config.json')).toBe(true);
    expect(existsSync('.factory/design.md')).toBe(true);

    rmSync('dist', { recursive: true, force: true });
    execFileSync(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'build'], { stdio: 'pipe' });
    expect(existsSync('dist/index.html')).toBe(true);
    expect(existsSync('dist/404.html')).toBe(true);
    const builtIndex = readFileSync('dist/index.html', 'utf8');
    const assets = [...builtIndex.matchAll(/(?:src|href)="(\/assets\/[^"?]+)"/g)].map((match) => `dist${match[1]}`);
    expect(assets.length).toBeGreaterThan(0);
    for (const asset of assets) expect(existsSync(asset), `missing built asset ${asset}`).toBe(true);
  });
});
