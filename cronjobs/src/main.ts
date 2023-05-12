import fs from 'fs';
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

(async (url: string, htmlFile: string) => {
  console.log('script started.');

  console.log('htmlFile', htmlFile.trim());
  console.log('url', url.trim());

  try {
    console.log('get body.');
    const html = fs.readFileSync(htmlFile.trim(), 'utf8');

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

    console.log('post to api.');
    const response = await fetch(process.env.WEBPAGE_SUMMARIZER_API_URL, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        url: url.trim(),
        markdown: trimmedMarkdown,
        apiKey: process.env.WEBPAGE_SUMMARIZER_API_KEY,
      }),
      redirect: 'follow',
    });

    const message = await response.text();
    console.log('response', response.status, message);
  } catch (error) {
    console.error('error', error);
    return;
  } finally {
    console.log('script finished.');
  }
})(process.argv[2], process.argv[3]);
