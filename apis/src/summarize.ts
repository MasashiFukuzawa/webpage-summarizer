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
