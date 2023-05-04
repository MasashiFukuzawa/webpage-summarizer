import { Hono } from 'hono';
import convertToMarkdown from './markdown-convertor';
import trimHtml from './trimming';

const app = new Hono();

// GET is appropriate, but POST is used
// because of the possibility of huge HTML being crossed.
app.post('/', async (c) => {
  const html = await c.req.text();

  // Trimmed to reduce the number of tokens (cost)
  // before passing to the ChatGPT API,
  // and to remove as much meaningless data as possible
  const trimmedHtml = trimHtml(html);

  // HTML tags are converted to Markdown
  // to further compress the character count.
  // Note, however, that this is a rough markdown.
  const markdown = convertToMarkdown(trimmedHtml);

  return c.text(markdown);
});

export default app;
