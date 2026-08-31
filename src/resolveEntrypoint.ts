import fs from 'fs';
import path from 'path';

// Existence-based entrypoint resolution, mirroring @gasbuddy/service's
// resolveEntrypoint semantics (service/src/transpiler.ts): rewrite a build/
// main to its src/ equivalent and prefer the .ts variant if it exists on
// disk, else fall back to .js.
export function resolveEntrypoint(rootDirectory: string, main: string): string {
  const base = main
    .replace(/^(\.?\/?)build\//, '$1src/')
    .replace(/\.(js|ts)$/, '');
  const tsPath = `${base}.ts`;
  const jsPath = `${base}.js`;
  if (fs.existsSync(path.resolve(rootDirectory, tsPath))) {
    return tsPath;
  }
  // Neither exists: return the preferred (.ts) extension so the downstream require()
  // error is against the entry that was actually asked for, not an arbitrary guess.
  return fs.existsSync(path.resolve(rootDirectory, jsPath)) ? jsPath : tsPath;
}
