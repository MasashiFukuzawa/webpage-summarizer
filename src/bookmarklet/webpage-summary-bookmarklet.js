(async function () {
  const html = document.documentElement.innerHTML;
  const convertedText = await fetch('http://127.0.0.1:51679', {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain',
    },
    body: html,
  });
  const summary = await fetch('http://127.0.0.1:51696', {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain',
    },
    body: convertedText,
  });
  const w = window.open('', '_blank');
  w.document.write(
    `<html>
      <head>
        <title>Summary by ChatGPT</title>
      </head>
      <body>
        <pre>
          ${summary
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')}
        </pre>
      </body>
    </html>`
  );
  w.document.close();
})();
