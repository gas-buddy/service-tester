import { Router } from 'express';

export default function route(router: Router) {
  router.get('/', (req, res) => {
    res.json({});
  });
}
