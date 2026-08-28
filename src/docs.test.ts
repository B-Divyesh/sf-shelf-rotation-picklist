// @ts-nocheck -- Vitest runs this repository-inspection test under Node.
import { readFileSync, existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('release documents', () => {
  it('@claim:docs-build records the supported Node version, deployment build, and MIT license', () => {
    const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as { engines: { node: string }, scripts: { build: string } };
    expect(packageJson.engines.node).toBe('>=20');
    expect(packageJson.scripts.build).toContain('vite build');
    expect(readFileSync('LICENSE', 'utf8')).toContain('Permission is hereby granted');
    expect(existsSync('public/staticwebapp.config.json')).toBe(true);
    expect(existsSync('.factory/design.md')).toBe(true);
  });
});
