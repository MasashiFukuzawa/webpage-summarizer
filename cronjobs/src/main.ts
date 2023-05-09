import { JSDOM } from 'jsdom';
import fetch from 'node-fetch';
import TurndownService from 'turndown';

import * as dotenv from 'dotenv';

dotenv.config();

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      WEBPAGE_SUMMARIZER_API_URL: string;
      WEBPAGE_SUMMARIZER_API_KEY: string;
    }
  }
}

(async (url: string, html: string) => {
  console.log(url);
  console.log(html);

  console.log('script started.');

  console.log('get body.');
  const { window } = new JSDOM(html);
  const { document } = window;
  const body = document.body;

  console.log('remove unnecessary tags.');
  const tags = ['header', 'footer', 'style', 'script', 'noscript'];
  for (const tag of tags) {
    const elements = body.getElementsByTagName(tag);
    for (let i = elements.length - 1; i >= 0; i--) {
      const parentNode = elements[i].parentNode;
      if (parentNode) {
        elements[i].parentNode?.removeChild(elements[i]);
      }
    }
  }

  console.log('convert html to markdown.');
  const turndownService = new TurndownService();
  const markdown = turndownService.turndown(body.innerHTML);
  // We remove the contents of the parentheses
  // because we believe that they often contain URLs, supplementary information,
  // and other strings that are meaningless to ChatGPT.
  const trimmedMarkdown = markdown.replace(/\([^()]*\)/g, '');

  console.log('trimmedMarkdown', trimmedMarkdown);

  console.log('post to api.');
  await fetch(process.env.WEBPAGE_SUMMARIZER_API_URL, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      url,
      markdown: trimmedMarkdown,
      apiKey: process.env.WEBPAGE_SUMMARIZER_API_KEY,
    }),
  });

  console.log('script finished.');
})(process.argv[2], process.argv[3]);
