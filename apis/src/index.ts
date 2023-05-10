/**
 * Handles GET requests to the web app. Returns a list of URLs that match the filter criteria.
 * @param {GoogleAppsScript.Events.DoGet} e - The event object representing the GET request.
 * @returns {GoogleAppsScript.Content.TextOutput} The text output containing a JSON string with a list of URLs.
 * @throws {Error} If the request is not authorized or if there is an error retrieving the summary data.
 */
const doGet = (
  e: GoogleAppsScript.Events.DoGet
): GoogleAppsScript.Content.TextOutput => {
  authorize(e.parameter.apiKey);

  const filter = (row: Summary) => !!row.url && !row.content;

  const { rows } = getSummaryData(filter);

  if (!rows) {
    return ContentService.createTextOutput(
      JSON.stringify({ urls: [] })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  const urls = rows.map((row) => row.url);

  return ContentService.createTextOutput(JSON.stringify({ urls })).setMimeType(
    ContentService.MimeType.JSON
  );
};

/**
 * Handles POST requests to the web app. Summarizes the content of the specified URL and updates the summary sheet with the results.
 * @param {GoogleAppsScript.Events.DoPost} e - The event object representing the POST request.
 * @returns {GoogleAppsScript.Content.TextOutput} The text output indicating whether the summarization was successful or not.
 * @throws {Error} If the request is not authorized or if there is an error summarizing the content.
 */
const doPost = (
  e: GoogleAppsScript.Events.DoPost
): GoogleAppsScript.Content.TextOutput => {
  authorize(e.parameter.apiKey);

  const url = e.parameter.url;
  const markdown = e.parameter.markdown;

  const filter = (row: Summary) => url === row.url && !row.summary;

  const { rows, summarySheet, lastColumn } = getSummaryData(filter);
  if (!rows) {
    return ContentService.createTextOutput('There is no target.').setMimeType(
      ContentService.MimeType.TEXT
    );
  }

  rows.forEach((row) => {
    summarySheet
      .getRange(row.rowNum, START_COLUMN_NUM, 1, lastColumn)
      .setValues([[markdown, 'Processing...', url, today]]);
    SpreadsheetApp.flush();
  });

  const { partialPrompt, fullPrompt } = getPromptData();

  let error: Error | null = null;
  rows.forEach((row) => {
    try {
      // Loop until partialSummary is within 3000 characters.
      let partialSummary = '';
      let i = 0;
      while (!partialSummary || partialSummary.length > 3000) {
        i++;
        partialSummary = getPartialSummary(partialPrompt, row.content);
      }

      const fullSummary = getFullSummary(fullPrompt, partialSummary);

      summarySheet
        .getRange(row.rowNum, START_COLUMN_NUM, 1, lastColumn)
        .setValues([[markdown, fullSummary, url, today]]);

      SpreadsheetApp.flush();
    } catch (e) {
      error = e as Error;
      logError(error);
    }
  });

  filterLatestSummaries();

  const message = !error ? 'Success!' : 'Error occurred. Please check the log.';
  return ContentService.createTextOutput(message).setMimeType(
    ContentService.MimeType.TEXT
  );
};
