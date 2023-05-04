import { Hono } from 'hono';
import getPartialSummary from './partial-summary';
import { Bindings } from './schema';

const app = new Hono<{ Bindings: Bindings }>();

app.post('/', async (c) => {
  const input = await c.req.text();
  const output = await getPartialSummary(input, c.env);
  return c.text(output);
});

export default app;
