# webpage-summarizer

[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE)

Some scripts for summarizing the content of webpages by analyzing their HTML. Easily extract key information from any webpage and view it in a condensed format.

## Setup

```sh
git clone git@github.com:MasashiFukuzawa/webpage-summarizer.git
```

### Bookmarklet

Follow these steps to set up the bookmarklet:

Create a new bookmark in your browser. You can do this by right-clicking on your bookmarks bar and selecting "Add Page" or "Add Bookmark" depending on the browser you are using.

Give the bookmark a name (e.g., "Convert to Markdown").

In the URL field, copy and paste the following script:

```js
javascript:(function%20()%20%7B%0A%20%20const%20d%20%3D%20document%3B%0A%20%20let%20s%20%3D%20d.createElement('script')%3B%0A%20%20s.src%20%3D%20'https%3A%2F%2Funpkg.com%2Fturndown%405.0.3%2Fdist%2Fturndown.js'%3B%0A%20%20s.onload%20%3D%20async%20function%20()%20%7B%0A%20%20%20%20const%20clonedBody%20%3D%20d.body.cloneNode(true)%3B%0A%0A%20%20%20%20const%20tags%20%3D%20%5B'header'%2C%20'footer'%2C%20'style'%2C%20'script'%2C%20'noscript'%5D%3B%0A%0A%20%20%20%20%2F%2F%20Remove%20the%20above%20tags%20beforehand%20as%20they%20create%20noise.%0A%20%20%20%20for%20(const%20tag%20of%20tags)%20%7B%0A%20%20%20%20%20%20const%20elements%20%3D%20clonedBody.getElementsByTagName(tag)%3B%0A%20%20%20%20%20%20for%20(let%20i%20%3D%20elements.length%20-%201%3B%20i%20%3E%3D%200%3B%20i--)%20%7B%0A%20%20%20%20%20%20%20%20elements%5Bi%5D.parentNode.removeChild(elements%5Bi%5D)%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%0A%20%20%20%20%2F%2F%20Convert%20to%20Markdown%20format%0A%20%20%20%20const%20turndownService%20%3D%20new%20TurndownService()%3B%0A%20%20%20%20const%20markdown%20%3D%20turndownService.turndown(clonedBody.innerHTML)%3B%0A%0A%20%20%20%20%2F%2F%20Replace%20the%20URL%20part%20of%20the%20Markdown%20format%20with%20an%20empty%20string.%0A%20%20%20%20const%20markdownUrlRegex%20%3D%20%2F%5C%5B(.*%3F)%5C%5D%5C((https%3F%3A%5C%2F%5C%2F%5B%5E%5Cs%5C)%5D%2B)%5C)%2Fg%3B%0A%20%20%20%20const%20trimmedMarkdown%20%3D%20markdown.replace(markdownUrlRegex%2C%20'%5B%241%5D()')%3B%0A%0A%20%20%20%20const%20newWindow%20%3D%20window.open()%3B%0A%20%20%20%20newWindow.document.write('%3Cpre%3E'%20%2B%20trimmedMarkdown%20%2B%20'%3C%2Fpre%3E')%3B%0A%20%20%20%20newWindow.document.close()%3B%0A%20%20%7D%3B%0A%20%20d.body.appendChild(s)%3B%0A%7D)()%3B
```

### Cloudflare Workers

Please refer to the official Hono documentation for more details.

https://hono.dev/getting-started/cloudflare-workers

```sh
cd cloudflare-workers
npm install
npm run dev
npm run deploy
```

### Google Apps Script

Please refer to clasp documentation for details if you needed.

https://github.com/google/clasp
