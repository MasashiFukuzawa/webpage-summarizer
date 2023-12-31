const START_ROW_NUM = 2;
const START_COLUMN_NUM = 1;

const HEADER_ROW_NUM = 1;

declare const dayjs: {
  dayjs(arg?: any): any;
};

const today = (): string => dayjs.dayjs().format('YYYY/M/D');

const getSheet = (
  sheetName: 'summaries' | 'prompts' | 'error_logs' | 'latest_summaries'
): GoogleAppsScript.Spreadsheet.Sheet => {
  const spreadsheetId = SpreadsheetApp.getActiveSpreadsheet().getId();
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

const getPromptData = (): PromptData => {
  const promptSheet = getSheet('prompts');

  const lastRow = promptSheet.getLastRow();
  const lastColumn = promptSheet.getLastColumn();

  const instructionColumnNum = 1;
  const constraintsColumnNum = 2;
  const typeColumnNum = 3;

  const prompts: Prompt[] = getFullData(promptSheet, lastRow, lastColumn)
    .map((row, i) => {
      return {
        // index starts from 0, but row number starts from 1.
        instruction: row[instructionColumnNum - 1],
        constraints: row[constraintsColumnNum - 1],
        type: row[typeColumnNum - 1],
        rowNum: i + START_ROW_NUM,
      };
    })
    .filter((row) => !!row);
  const partialPrompt = prompts.find((prompt) => prompt.type === 'partial')!;
  const fullPrompt = prompts.find((prompt) => prompt.type === 'full')!;

  return { partialPrompt, fullPrompt };
};
