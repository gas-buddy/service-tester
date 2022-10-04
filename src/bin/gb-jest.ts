#!/usr/bin/env node
import { run } from 'jest-cli';
import path from 'path';

const argv = [...process.argv.slice(2)];

async function jest() {
  if (!argv.find((a) => ['--config', '-c'].includes(a.split('=')[0]))) {
    const cwd = path.resolve('.');
    const hasRoots = argv.find((a) => a.split('=')[0] === '--roots');

    let config = await import('find-up').then(({ findUp }) => findUp('jest.config.js'));
    if (!config) {
      config = path.resolve(__dirname, '../../jest.config.js');
    }
    argv.push(`--config="${config}"`);
    if (!hasRoots) {
      argv.push(`--roots="${path.relative(path.dirname(config), cwd)}"`);
    }
  }
  run(argv);
}

jest();
