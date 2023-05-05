import { Hono } from 'hono';
import { basicAuth } from 'hono/basic-auth';

import getPartialSummary from './partial-summary';
import { Bindings } from './schema';

const app = new Hono<{ Bindings: Bindings }>();

app.use('*', async (c, next) => {
  const auth = basicAuth({
    username: c.env.USERNAME,
    password: c.env.PASSWORD,
  });
  return auth(c, next);
});

app.post('/', async (c) => {
  console.log('Request received.');
  const input = await c.req.text();
  const output = await getPartialSummary(input, c.env);
  console.log('Request completed.');
  return c.text(output);
});

export default app;
