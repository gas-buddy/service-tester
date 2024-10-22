import { createServiceClientInterface, Service, ServiceExpress } from '@gasbuddy/service';

export class FakeServImpl {
  app: ServiceExpress | undefined;

  constructor(app: any) {
    this.app = app;
  }

  // eslint-disable-next-line class-methods-use-this
  getSomething() {
    throw new Error('Should not be called.');
  }
}

export default function (): Service {
  return {
    start(app) {
      Object.assign(app.locals, {
        services: {
          fakeServ: createServiceClientInterface<FakeServImpl>('fake-serv', FakeServImpl),
        },
      });
    },
  };
}
