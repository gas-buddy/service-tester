service-tester
===============

![main CI](https://github.com/gas-buddy/service-tester/actions/workflows/nodejs.yml/badge.svg)

[![npm version](https://badge.fury.io/js/@gasbuddy%2Fservice-tester.svg)](https://badge.fury.io/js/@gasbuddy%2Fservice-tester)

This module makes it easier for you to write tests for your node.js GasBuddy microservice. Simply add
the module as a dev dependency:

```sh
yarn add -D @gasbuddy/service-tester
```

Then write a test in ```/__tests__/startup.test.js```:

```ts
import request from 'supertest';
import { getReusableApp, clearReusableApp } from '@gasbuddy/service-tester';
import myService from '../src/index';

describe('my service', () => {
  test('should start', async () => {
    const app = await getReusableApp(myService);
    expect(app).toBeTruthy();
    await request(app).get('/').expect(200);
  });
});
```

