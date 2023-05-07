const IGNORE_PREFIX = '[ERROR]';

const today = new Date().toLocaleDateString();

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

const splitLongTextByLength = (
  inputString: string,
  length = 3000
): string[] => {
  const chunks = [];
  for (let i = 0; i < inputString.length; i += length) {
    chunks.push(inputString.slice(i, i + length));
  }
  return chunks.filter((c) => !!c);
};

// The string is concatenated by dividing it into 3000 characters
// and summarizing each time.
const getPartialSummary = (prompt: Prompt, input: string): string => {
  const splittedInputs = splitLongTextByLength(input);

  let partialSummary = '';
  for (const input of splittedInputs) {
    const output = requestToChatGPT(prompt, input);
    partialSummary += `${output}\n\n`;
  }

  return partialSummary;
};

const getFullSummary = (prompt: Prompt, partialSummary: string): string => {
  return requestToChatGPT(prompt, partialSummary);
};

const summarize = (): void => {
  const filter = (row: Summary) =>
    !!row.content && !row.content.startsWith(IGNORE_PREFIX) && !row.summary;

  const { rows, summarySheet, lastColumn } = getSummaryData(filter);
  if (!rows) return;

  const { partialPrompt, fullPrompt } = getPromptData();

  rows.forEach((row) => {
    summarySheet
      .getRange(row.rowNum, START_COLUMN_NUM, 1, lastColumn)
      .setValues([[row.content, 'Processing...', row.url, today]]);
    SpreadsheetApp.flush();
  });

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
        .setValues([[row.content, fullSummary, row.url, today]]);

      SpreadsheetApp.flush();
    } catch (e) {
      error = e as Error;
      logError(error);
    }
  });

  if (error) {
    throw new Error('Error occurred. Please check the log.');
  }
};
