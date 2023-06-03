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

const summarize = () => {
  const filter = (row: Summary) => !!row.content && !row.summary;
  const { rows, summarySheet, lastColumn } = getSummaryData(filter);
  if (!rows) return;

  const { partialPrompt, fullPrompt } = getPromptData();

  // NOTE: GAS must finish processing within 6min.
  // Since summarization by ChatGPT is a somewhat time-consuming process,
  // only the first one is processed to avoid timeout errors.
  const row = rows[0];

  summarySheet
    .getRange(row.rowNum, START_COLUMN_NUM, 1, lastColumn)
    .setValues([[row.content, 'Processing...', row.url, today()]]);
  SpreadsheetApp.flush();

  try {
    // Loop until partialSummary is within 3000 characters.
    let partialSummary = '';
    let i = 0;
    while (!partialSummary || partialSummary.length > 3000) {
      i++;
      partialSummary = getPartialSummary(partialPrompt, row.content);
      summarySheet
        .getRange(row.rowNum, START_COLUMN_NUM, 1, lastColumn)
        .setValues([[row.content, partialSummary, row.url, today()]]);
      SpreadsheetApp.flush();
    }

    const fullSummary = getFullSummary(fullPrompt, partialSummary);

    summarySheet
      .getRange(row.rowNum, START_COLUMN_NUM, 1, lastColumn)
      .setValues([[row.content, fullSummary, row.url, today()]]);
    SpreadsheetApp.flush();
  } catch (e) {
    const error = e as Error;
    logError(error);
  }

  filterLatestSummaries();
};
