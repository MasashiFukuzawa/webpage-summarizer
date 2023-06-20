const trimmedLongTextByLength = (
  inputString: string,
  maxLength: number = 15_000
): string => {
  if (inputString.length <= maxLength) {
    return inputString;
  }
  const trimmedLength = inputString.length - maxLength;
  const trimmedStartIndex = Math.floor(trimmedLength / 2);
  const trimmedEndIndex = inputString.length - Math.floor(trimmedLength / 2);
  return inputString.slice(trimmedStartIndex, trimmedEndIndex);
};

const splitLongTextByLength = (
  inputString: string,
  length = 8000
): string[] => {
  const chunks = [];
  for (let i = 0; i < inputString.length; i += length) {
    chunks.push(inputString.slice(i, i + length));
  }
  return chunks.filter((c) => !!c);
};

const getPartialSummary = (prompt: Prompt, input: string): string => {
  // Input is trimmed to 15_000 characters.
  const trimmedInput = trimmedLongTextByLength(input);

  // The string is concatenated by dividing it into 8000 characters
  // and summarizing each time.
  const splittedInputs = splitLongTextByLength(trimmedInput);

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
  if (!rows.length) return;

  const { partialPrompt, fullPrompt } = getPromptData();

  // NOTE: GAS must finish processing within 6min.
  // Since summarization by ChatGPT is a somewhat time-consuming process,
  // only the first one is processed to avoid timeout errors.
  const row = rows[0];

  updateCell(summarySheet, row, 'Processing...', lastColumn);

  try {
    // Loop until partialSummary is within 3000 characters.
    let partialSummary = '';
    let i = 0;
    while (!partialSummary || partialSummary.length > 3000) {
      i++;
      partialSummary = getPartialSummary(partialPrompt, row.content);
      updateCell(summarySheet, row, partialSummary, lastColumn);
    }

    const fullSummary = getFullSummary(fullPrompt, partialSummary);

    updateCell(summarySheet, row, fullSummary, lastColumn);
  } catch (e) {
    const error = e as Error;
    logError(error);
  }

  filterLatestSummaries();
};
