(function () {
  const w = window.open('', '_blank');
  w.document.write(
    '<html><head><title>Summary by ChatGPT</title></head><body><pre>' +
      document.documentElement.innerHTML
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;') +
      '</pre></body></html>'
  );
  w.document.close();
})();
