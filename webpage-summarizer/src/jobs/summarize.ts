const updateCell = (
  summarySheet: GoogleAppsScript.Spreadsheet.Sheet,
  row: Summary,
  text: string,
  lastColumn: number
) => {
  summarySheet
    .getRange(row.rowNum, START_COLUMN_NUM, 1, lastColumn)
    .setValues([[row.content, text, row.url, today()]]);
  SpreadsheetApp.flush();
};

const isWithinOneMinute = (now: Date, lastExecution: string) => {
  return now.getTime() - new Date(lastExecution).getTime() < 1 * 60 * 1000;
};

const summarize = () => {
  const now = new Date();
  const lastExecution =
    PropertiesService.getScriptProperties().getProperty('lastExecution');

  // NOTE: Avoiding ChatGPT API rate limit errors
  // by avoiding concentrated requests
  if (lastExecution && isWithinOneMinute(now, lastExecution)) {
    return;
  }

  const filter = (row: Summary) => !!row.content && !row.summary;
  const { rows, summarySheet, lastColumn } = getSummaryData(filter);
  if (!rows.length) {
    return;
  }

  const prompt = getPrompt();

  rows.forEach((row) => {
    updateCell(summarySheet, row, 'Processing...', lastColumn);

    try {
      const fullSummary = requestToChatGPT(prompt, row.content);

      updateCell(summarySheet, row, fullSummary, lastColumn);
    } catch (e) {
      const error = e as Error;
      logError(error);
    }
  });

  filterLatestSummaries();
};
