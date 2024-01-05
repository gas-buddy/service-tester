export default function route(router) {
  router.get('/js', (req, res) => {
    res.json({});
  });

  router.post('/js', async (req, res) => {
    const { body } = await req.app.locals.services.fakeServ.get_something();
    res.json(body);
  });
}
