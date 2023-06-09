(function () {
  const d = document;
  let s = d.createElement('script');
  s.src = 'https://unpkg.com/turndown@5.0.3/dist/turndown.js';
  s.onload = async function () {
    const clonedBody = d.body.cloneNode(true);

    const tags = ['header', 'footer', 'style', 'script', 'noscript'];

    // Remove the above tags beforehand as they create noise.
    for (const tag of tags) {
      const elements = clonedBody.getElementsByTagName(tag);
      for (let i = elements.length - 1; i >= 0; i--) {
        elements[i].parentNode.removeChild(elements[i]);
      }
    }

    // Convert to Markdown format
    const turndownService = new TurndownService();
    const markdown = turndownService.turndown(clonedBody.innerHTML);

    // We remove the contents of the parentheses
    // because we believe that they often contain URLs, supplementary information,
    // and other strings that are meaningless to ChatGPT.
    const trimmedMarkdown = markdown.replace(/\([^()]*\)/g, '');

    const newWindow = window.open();
    newWindow.document.write('<pre>' + trimmedMarkdown + '</pre>');
    newWindow.document.close();
  };
  d.body.appendChild(s);
})();
