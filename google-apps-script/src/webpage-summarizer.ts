const base64Encode = (): string => {
  const username =
    PropertiesService.getScriptProperties().getProperty('USERNAME')!;
  const password =
    PropertiesService.getScriptProperties().getProperty('PASSWORD')!;
  const str = `${username}:${password}`;
  return Utilities.base64Encode(str);
};

const logError = (error: Error) => {
  const sheetName = 'error_logs';
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let logsSheet = spreadsheet.getSheetByName(sheetName)!;

  const timestamp = new Date();
  const errorMessage = error.message;
  const errorStack = error.stack;
  logsSheet.appendRow([timestamp, errorMessage, errorStack]);
};

const summarize = (): void => {
  try {
    const spreadsheetId =
      PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID')!;
    const sheet =
      SpreadsheetApp.openById(spreadsheetId).getSheetByName('summaries')!;

    const START_ROW_NUM = 2;
    const START_COLUMN_NUM = 1;
    const CONTENT_COLUMN_NUM = 1;
    const SUMMARY_COLUMN_NUM = 2;

    const lastRow = sheet.getLastRow();
    const lastCol = sheet.getLastColumn();

    const data = sheet
      .getRange(START_ROW_NUM, START_COLUMN_NUM, lastRow - 1, lastCol)
      .getValues();
    const formatted = data
      .map((row, i) => {
        return {
          content: row[CONTENT_COLUMN_NUM - 1],
          summary: row[SUMMARY_COLUMN_NUM - 1],
          rowNum: i + START_ROW_NUM,
        };
      })
      .filter((row) => row.content && !row.summary);

    // Display the summary's main points in the spreadsheet beforehand.
    formatted.forEach((row) => {
      sheet.getRange(row.rowNum, SUMMARY_COLUMN_NUM).setValue('Summarizing...');
    });

    formatted.forEach((row) => {
      const apiUrl = PropertiesService.getScriptProperties().getProperty(
        'CLOUDFLARE_WORKERS_BASE_URL'
      )!;
      const response = UrlFetchApp.fetch(apiUrl, {
        method: 'post',
        payload: {
          data: row.content,
        },
        headers: {
          'Content-Type': 'text/plain',
          Authorization: `Basic ${base64Encode()}`,
        },
      });
      const summary = response.getContentText();
      sheet.getRange(row.rowNum, SUMMARY_COLUMN_NUM).setValue(summary);
    });
  } catch (e) {
    const error = e as Error;
    logError(error);
  }
};
