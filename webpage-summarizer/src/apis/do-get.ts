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
  const urls = fetchTargetUrls();
  return ContentService.createTextOutput(JSON.stringify({ urls })).setMimeType(
    ContentService.MimeType.JSON
  );
};
