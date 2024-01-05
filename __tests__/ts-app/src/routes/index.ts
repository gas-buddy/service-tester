import { ServiceRouter } from '@gasbuddy/service';
import { FakeServLocals } from '../types';

export default function route(router: ServiceRouter<FakeServLocals>) {
  router.get('/', (req, res) => {
    res.json({});
  });

  router.post('/', async (req, res) => {
    const { body } = await req.app.locals.services.fakeServ.get_something();
    res.json(body);
  });
}
