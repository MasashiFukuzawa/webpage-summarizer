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

  const urls = rows.map((row) => row.url);

  return ContentService.createTextOutput(JSON.stringify({ urls })).setMimeType(
    ContentService.MimeType.JSON
  );
};

/**
 * Handles POST requests to the web app. Updates the summary sheet with the results.
 * @param {GoogleAppsScript.Events.DoPost} e - The event object representing the POST request.
 * @returns {GoogleAppsScript.Content.TextOutput} The text output indicating whether the summarization was successful or not.
 * @throws {Error} If the request is not authorized or if there is an error summarizing the content.
 */
const doPost = (
  e: GoogleAppsScript.Events.DoPost
): GoogleAppsScript.Content.TextOutput => {
  let error: Error | null = null;

  try {
    const params = JSON.parse(e.postData.contents);

    authorize(params.apiKey);

    const url = params.url;
    let markdown = params.markdown;

    const filter = (row: Summary) => url === row.url.trim() && !row.summary;
    const { rows, summarySheet, lastColumn } = getSummaryData(filter);
    if (!rows.length) {
      return ContentService.createTextOutput('There is no target.').setMimeType(
        ContentService.MimeType.TEXT
      );
    }

    // NOTE: The string is concatenated by dividing it into 50000 characters
    // because the maximum number in a google spreadsheet cell is 50000.
    if (markdown.length > 50000) {
      markdown = markdown.substring(0, 50000);
    }

    rows.forEach((row) => {
      summarySheet
        .getRange(row.rowNum, START_COLUMN_NUM, 1, lastColumn)
        .setValues([[markdown, null, url, today()]]);
    });
  } catch (e) {
    error = e as Error;
    logError(error);
  } finally {
    const message = !error
      ? 'Success!'
      : 'Error occurred. Please check the log.';
    return ContentService.createTextOutput(message).setMimeType(
      ContentService.MimeType.TEXT
    );
  }
};
