import { ServiceRouter } from '@gasbuddy/service';
import { FakeServLocals } from '../types';

export default function route(router: ServiceRouter<FakeServLocals>) {
  router.get('/', (req, res) => {
    res.json({});
  });

  router.post('/', async (req, res) => {
    const { fakeServ } = req.app.locals.services;
    const { body } = await fakeServ(req.app).getSomething();
    res.json(body);
  });
}
