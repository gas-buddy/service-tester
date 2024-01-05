export default function route(router) {
  router.get('/', (req, res) => {
    res.json({});
  });

  router.post('/', async (req, res) => {
    const { body } = await req.app.locals.services.fakeServ.get_something();
    res.json(body);
  });
}
