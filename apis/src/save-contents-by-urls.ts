const MAX_LENGTH_IN_A_CELL = 50_000;
const HTML_PARSING_ERROR_MESSAGE = '[ERROR] HTML parsing failed.';

const errorOccurred = (markdown: string): boolean => {
  const first100Chars = markdown.slice(0, 100);
  return (
    first100Chars.toLowerCase().includes('not found') ||
    first100Chars.includes('404')
  );
};

const saveContentsByUrls = (): void => {
  const filter = (row: Summary) => !!row.url && !row.content;

  const { rows, summarySheet, lastColumn } = getSummaryData(filter);
  if (!rows) return;

  try {
    rows.forEach((row) => {
      let markdown = '';

      try {
        markdown = convertHtmlToMarkdown(row.url);
      } catch (e) {
        const error = e as Error;
        logError(error);
        markdown = HTML_PARSING_ERROR_MESSAGE;
      }

      if (errorOccurred(markdown)) {
        markdown = `[ERROR] ${markdown}`;
      }

      // NOTE: The maximum number of characters that can be set
      // in a cell of google spreadsheet is 50,000.
      markdown =
        markdown.length > MAX_LENGTH_IN_A_CELL
          ? markdown.slice(0, MAX_LENGTH_IN_A_CELL)
          : markdown;

      summarySheet
        .getRange(row.rowNum, START_COLUMN_NUM, 1, lastColumn)
        .setValues([[markdown, null, row.url, null]]);

      SpreadsheetApp.flush();
    });
  } catch (e) {
    const error = e as Error;
    logError(error);
    throw error;
  }
};
