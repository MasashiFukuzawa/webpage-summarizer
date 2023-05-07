const START_ROW_NUM = 2;
const START_COLUMN_NUM = 1;

const HEADER_ROW_NUM = 1;

const today = new Date().toLocaleDateString();

const getSheet = (
  sheetName: 'summaries' | 'prompts' | 'error_logs' | 'latest_summaries'
): GoogleAppsScript.Spreadsheet.Sheet => {
  const spreadsheetId =
    PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID')!;
  const sheet =
    SpreadsheetApp.openById(spreadsheetId).getSheetByName(sheetName)!;
  return sheet;
};

const getFullData = (
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  lastRow: number,
  lastColumn: number
): any[][] => {
  return sheet
    .getRange(
      START_ROW_NUM,
      START_COLUMN_NUM,
      lastRow - HEADER_ROW_NUM,
      lastColumn
    )
    .getValues();
};

const getSummaryData = (filter: (row: Summary) => boolean): SummaryData => {
  const summarySheet = getSheet('summaries');

  const contentColumnNum = 1;
  const summaryColumnNum = 2;
  const urlColumnNum = 3;
  const dateColumnNum = 4;

  const lastRow = summarySheet.getLastRow();
  const lastColumn = summarySheet.getLastColumn();

  const rows: Summary[] = getFullData(summarySheet, lastRow, lastColumn)
    .map((row, i) => {
      return {
        // index starts from 0, but row number starts from 1.
        content: row[contentColumnNum - 1],
        summary: row[summaryColumnNum - 1],
        url: row[urlColumnNum - 1],
        date: row[dateColumnNum - 1],
        rowNum: i + START_ROW_NUM,
      };
    })
    .filter((row) => filter(row));

  return { rows, summarySheet, lastColumn };
};

const logError = (error: Error) => {
  const logsSheet = getSheet('error_logs');
  const timestamp = new Date();
  const errorMessage = error.message;
  const errorStack = error.stack;
  logsSheet.appendRow([timestamp, errorMessage, errorStack]);
};
