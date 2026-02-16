import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

describe('Build Configuration', () => {
  it('should have correct vite config with base path for Electron', () => {
    const viteConfig = readFileSync(join(__dirname, '../../vite.config.ts'), 'utf-8');
    expect(viteConfig).toContain("base: './'");
  });

  it('should have electron-builder configuration in package.json', () => {
    const packageJson = JSON.parse(readFileSync(join(__dirname, '../../package.json'), 'utf-8'));
    expect(packageJson.build).toBeDefined();
    expect(packageJson.build.appId).toBe('com.wfh-dashboard-v2.app');
    expect(packageJson.build.productName).toBe('WFH Dashboard');
  });

  it('should have build scripts in package.json', () => {
    const packageJson = JSON.parse(readFileSync(join(__dirname, '../../package.json'), 'utf-8'));
    expect(packageJson.scripts['electron:build']).toBeDefined();
    expect(packageJson.scripts['electron:build:win']).toBeDefined();
    expect(packageJson.scripts['electron:build:mac']).toBeDefined();
    expect(packageJson.scripts['electron:build:linux']).toBeDefined();
  });

  it('should have BUILD.md documentation file', () => {
    const buildMdExists = existsSync(join(__dirname, '../../BUILD.md'));
    expect(buildMdExists).toBe(true);
  });

  it('should have release directory in gitignore', () => {
    const gitignore = readFileSync(join(__dirname, '../../.gitignore'), 'utf-8');
    expect(gitignore).toContain('release/');
  });
});
