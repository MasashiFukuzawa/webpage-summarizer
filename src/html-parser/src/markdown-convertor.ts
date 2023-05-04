export const convertToMarkdown = (html: string): string => {
  const splittedHtml = html.split('\n');
  let markdownList: string[] = [];
  splittedHtml.forEach((h) => {
    let sentence = h.trim();
    if (!sentence) return;

    if (sentence.startsWith('<h1')) {
      sentence = `# ${sentence.replace(/<h1(?:>)/g, '')}`;
    } else if (sentence.startsWith('<h2')) {
      sentence = `## ${sentence.replace(/<h2(?:>)/g, '')}`;
    } else if (sentence.startsWith('<h3')) {
      sentence = `### ${sentence.replace(/<h3(?:>)/g, '')}`;
    } else if (sentence.startsWith('<h4')) {
      sentence = `#### ${sentence.replace(/<h4(?:>)/g, '')}`;
    } else if (sentence.startsWith('<h5')) {
      sentence = `##### ${sentence.replace(/<h5(?:>)/g, '')}`;
    } else if (sentence.startsWith('<h6')) {
      sentence = `###### ${sentence.replace(/<h6(?:>)/g, '')}`;
    } else if (sentence.startsWith('<p')) {
      sentence = `${sentence.replace(/<p(?:>)/g, '')}`;
    } else if (sentence.startsWith('<li') || sentence.startsWith('<ol')) {
      if (sentence.replace(/<li(?:>)|<ol(?:>)/g, '- ') !== '- ') {
        sentence = sentence.replace(/<li(?:>)|<ol(?:>)/g, '- ');
      }
    }

    if (sentence.match(/<strong>|<b>/g)) {
      if (sentence.replace(/<strong>|<b>/g, ' **') !== ' **') {
        sentence = `${sentence.replace(/<strong>|<b>/g, ' **')}** `;
      }
    }

    if (sentence.match(/<i>/g)) {
      if (sentence.replace(/<i>/g, ' *') !== ' *') {
        sentence = `${sentence.replace(/<i>/g, ' *')}* `;
      }
    }

    if (!sentence) return;

    markdownList.push(sentence);
  });
  return markdownList.join('\n');
};

export default convertToMarkdown;
