import path from 'path';
import { resolveEntrypoint } from '../src/resolveEntrypoint';

const FIXTURES = path.resolve(__dirname, './resolveEntrypoint-fixtures');
const tsOnlyDir = path.resolve(FIXTURES, './ts-only');
const jsOnlyDir = path.resolve(FIXTURES, './js-only');
const mixedDir = path.resolve(FIXTURES, './mixed');

describe('resolveEntrypoint', () => {
  test('TS-only app: prefers the existing .ts entry', () => {
    expect(resolveEntrypoint(tsOnlyDir, 'build/index.js')).toBe('src/index.ts');
  });

  test('JS-only app: falls back to .js when .ts does not exist', () => {
    expect(resolveEntrypoint(jsOnlyDir, 'build/index.js')).toBe('src/index.js');
  });

  test('mixed app: prefers .ts when both .ts and .js exist', () => {
    expect(resolveEntrypoint(mixedDir, 'build/index.js')).toBe('src/index.ts');
  });

  test('a main already pointing at src/ is normalized the same way', () => {
    expect(resolveEntrypoint(mixedDir, 'src/index.js')).toBe('src/index.ts');
  });

  test('neither variant exists: falls back to .ts (the honest, requested default)', () => {
    expect(resolveEntrypoint(tsOnlyDir, 'build/missing.js')).toBe('src/missing.ts');
  });
});
