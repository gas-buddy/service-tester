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

Service call mocking
--

Nock is so 2010. The future is mock! Since we have typed clients for services these days, mocking them is easier. We've played some nutty
tricks with Typescript (well, nutty for me), to enable this kind of syntax:

```
  mockServiceCall(app.locals.services.myCrazyServ, 'get_some_resource').mockResolvedValue({
    status: 200,
    responseType: 'response',
    body: { resource: true },
  });
```

This will cause calls to `app.locals.services.myCrazyServ.get_some_resource()` to return `{resource: true}`. This is just shorthand
for `jest.spyOn(service, 'method')` with knowledge of the traditional return type of OpenAPI service calls.
