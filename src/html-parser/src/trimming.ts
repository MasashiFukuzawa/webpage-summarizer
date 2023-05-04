const trimSpecificTags = (html: string): string => {
  const tags = [
    'header',
    'footer',
    'head',
    'style',
    'script',
    'noscript',
    'button',
    'form',
    'input',
    'iframe',
    'nav',
    'br',
    'ul',
    'cite',
    'grammarly-desktop-integration',
  ];
  let trimmedHtml = html;
  tags.forEach((tag) => {
    const regexPattern = new RegExp(
      `<${tag}\\b[^<]*(?:(?!<\\/${tag}>)<[^<]*)*<\\/${tag}>`,
      'gi'
    );
    trimmedHtml = trimmedHtml.replace(regexPattern, '');
  });
  return trimmedHtml;
};

const trimSpecificAttributes = (html: string): string => {
  const attributes = [
    'id',
    'class',
    'style',
    'href',
    'src',
    'width',
    'height',
    'alt',
    'loading',
    'title',
    'item.*',
    'data-.*',
    'rel',
    'role',
    'tabindex',
    'aria-.*',
  ];
  const regexPattern = new RegExp(
    `\\s*(${attributes.join('|')})="[^"]*"`,
    'gi'
  );
  return html.replace(regexPattern, '');
};

const trimUrls = (html: string): string => {
  const urlRegex =
    /(https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*))/gi;
  return html.replace(urlRegex, '');
};

const trimComments = (html: string): string => {
  return html.replace(/<!--[\s\S]*?-->/g, '');
};

const trimEmptyLines = (html: string): string => {
  const lines = html.split('\n');
  const nonEmptyLines = lines.filter((line) => !!line);
  return nonEmptyLines.join('\n');
};

const trimExtraTags = (html: string): string => {
  return html.replace(
    /<\/\w+>|<a>|<figure>|<figcaption>|<img>|<svg>|<span>|<div>|<pre>|<aside>|<body>|<article>/g,
    ''
  );
};

const trimHtml = (html: string): string => {
  let trimmedHtml = html;
  trimmedHtml = trimSpecificTags(trimmedHtml);
  trimmedHtml = trimSpecificAttributes(trimmedHtml);
  trimmedHtml = trimUrls(trimmedHtml);
  trimmedHtml = trimComments(trimmedHtml);
  trimmedHtml = trimEmptyLines(trimmedHtml);
  trimmedHtml = trimExtraTags(trimmedHtml);
  return trimmedHtml;
};

export default trimHtml;
