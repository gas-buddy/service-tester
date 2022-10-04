import request from 'supertest';
import { getReusableApp, clearReusableApp } from '../src';

import type { Service, ServiceStartOptions } from '@gasbuddy/service';

function getFakeServiceFn(flags: { started: number; stopped: number }): () => Service {
  return () => ({
    start(app) {
      flags.started += 1;
    },
    async stop() {
      flags.stopped += 1;
    },
  });
}

describe('Start and stop shared app', () => {
  const flags = { started: 0, stopped: 0 };
  const options: ServiceStartOptions = {
    service: getFakeServiceFn(flags),
    rootDirectory: __dirname,
    codepath: 'src',
    name: 'fake-serv',
  };

  test('Start reusable app', async () => {
    const app = await getReusableApp(options);
    expect(app).toBeTruthy();
    const secondApp = await getReusableApp(options);
    expect(secondApp).toEqual(app);
    expect(flags.started).toEqual(1);
    expect(flags.stopped).toEqual(0);
  });

  test('Should reuse app', async () => {
    const app = await getReusableApp();
    expect(app).toBeTruthy();
    expect(flags.started).toEqual(1);
    expect(flags.stopped).toEqual(0);
  });

  test('Should make requests', async () => {
    const app = await getReusableApp();
    await request(app).get('/').expect(200);
    await request(app).get('/foobar').expect(404);
  });

  test('Should shut down app', async () => {
    const exapp = await getReusableApp();
    await clearReusableApp();
    expect(flags.started).toEqual(1);
    expect(flags.stopped).toEqual(1);
    expect(() => getReusableApp()).rejects.toThrow('no options');
    const app = await getReusableApp(options);
    expect(flags.started).toEqual(2);
    expect(flags.stopped).toEqual(1);
    expect(app).not.toEqual(exapp);
    await clearReusableApp();
    expect(flags.started).toEqual(2);
    expect(flags.stopped).toEqual(2);
  });
});
