#!/usr/bin/env node
import { run } from 'jest-cli';
import path from 'path';

// Fix for Next.js issues with Jest
// eslint-disable-next-line no-underscore-dangle
process.env.__NEXT_TEST_MODE = 'jest';

const argv = [...process.argv.slice(2)];

async function jest() {
  if (!argv.find((a) => ['--config', '-c'].includes(a.split('=')[0]))) {
    const cwd = path.resolve('.');
    const hasRoots = argv.find((a) => a.split('=')[0] === '--roots');

    const config = await import('find-up').then(({ findUp }) => findUp('jest.config.js'));
    if (!config) {
      throw new Error(`Missing jest.config.js. Please add the following to a jest.config.js in the root directory of your project:

module.exports = require('@gasbuddy/service-tester').jestConfig;

If you need custom configuration, just spread that config into an object and
add your bits (or just build your own config).
`);
    }
    argv.push(`--config="${config}"`);
    if (!hasRoots) {
      argv.push(`--roots="${path.relative(path.dirname(config), cwd)}"`);
    }
  }
  run(argv);
}

jest();
