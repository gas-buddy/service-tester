import request from 'supertest';
import { createServiceClientInterface, type Service, type ServiceStartOptions } from '@gasbuddy/service';
import {
  getReusableApp, clearReusableApp, getExistingApp,
  mockServiceClientCall,
} from '../src';

import { FakeServLocals } from './src/types';
import { FakeServImpl } from './src';

function getFakeServiceFn(flags: {
  started: number;
  stopped: number;
}): () => Service<FakeServLocals> {
  return () => ({
    start(app) {
      Object.assign(app.locals, {
        services: {
          fakeServ: createServiceClientInterface<FakeServImpl>('fake-serv', FakeServImpl),
        },
      });
      flags.started += 1;
    },
    async stop() {
      flags.stopped += 1;
    },
  });
}

describe('Start and stop shared app', () => {
  const flags = { started: 0, stopped: 0 };
  const options: ServiceStartOptions<FakeServLocals> = {
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
    const app = await getExistingApp();
    expect(app).toBeTruthy();
    expect(flags.started).toEqual(1);
    expect(flags.stopped).toEqual(0);
  });

  test('Should make requests', async () => {
    const app = await getExistingApp<FakeServLocals>();
    await request(app).get('/').expect(200);
    await request(app).get('/foobar').expect(404);
    await request(app).post('/').expect(500);
    app.locals.services.fakeServ = jest.fn().mockImplementation(() => ({
      getSomething() {
        return {
          body: {
            things: ['a', 'b', 'c'],
          },
        };
      },
    }));
    const { body } = await request(app).post('/').expect(200);
    expect(body.things).toBeTruthy();
    expect(body.things.length).toEqual(3);
  });

  test('Should shut down app', async () => {
    const exapp = await getExistingApp();
    await clearReusableApp();
    expect(flags.started).toEqual(1);
    expect(flags.stopped).toEqual(1);
    expect(Promise.resolve().then(getExistingApp)).rejects.toThrow('requires a running app');
    const app = await getReusableApp(options);
    expect(flags.started).toEqual(2);
    expect(flags.stopped).toEqual(1);
    expect(app).not.toEqual(exapp);
    await clearReusableApp();
    expect(flags.started).toEqual(2);
    expect(flags.stopped).toEqual(2);
  });

  test('Should load app with defaults', async () => {
    await getReusableApp({
      rootDirectory: __dirname,
    });
  });
});
