import { Hono } from 'hono';
import getPartialSummary from './partial-summary';
import { Bindings } from './schema';

const app = new Hono<{ Bindings: Bindings }>();

app.post('/', async (c) => {
  const input = await c.req.text();

  // The string is concatenated by dividing it into 3000 characters and summarizing each time.
  // And repeat until the partial summary is less than 3000 characters.
  let mutableInput = input;
  let output = '';
  while (mutableInput.length >= 3000) {
    console.log('mutableInput.length', mutableInput.length);
    output = await getPartialSummary(mutableInput, c.env);
    mutableInput = output;
  }

  return c.text(output);
});

export default app;
