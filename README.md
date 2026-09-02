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
    headers: new Headers(),
  });
```

This will cause calls to `app.locals.services.myCrazyServ.get_some_resource()` to return `{resource: true}`. This is just shorthand
for `jest.spyOn(service, 'method')` with knowledge of the traditional return type of OpenAPI service calls.

Web apps
--

The exported `jestConfig` is ts-node-based, which suits API/job services but doesn't fit web apps that run
through Babel (JSX, CSS modules, `@loadable/component`). For those, use `webJestConfig` instead — it's a
babel-jest two-project config with a `unit` project (jsdom, for component tests co-located under `src/`)
and an `integration` project (node, for SSR/service-boot tests under `tests/`), and it maps static asset
imports (`.svg`/`.png`/`.jpe?g`/`.gif`) to a stub so component tests don't need a real file-loader.

```js
// jest.config.js
module.exports = require('@gasbuddy/service-tester').webJestConfig;
```

Each project is also exported individually (`webJestUnitProjectConfig`, `webJestIntegrationProjectConfig`)
so an app can override or extend just one of them:

```js
// jest.config.js
const {
  webJestUnitProjectConfig,
  webJestIntegrationProjectConfig,
} = require('@gasbuddy/service-tester');

module.exports = {
  projects: [
    { ...webJestUnitProjectConfig, setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'] },
    webJestIntegrationProjectConfig,
  ],
};
```

Run either config through `gb-jest` the same way as the ts-node-based `jestConfig`.
