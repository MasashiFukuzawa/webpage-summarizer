import getSummary from './chatgpt-client';
import { Bindings } from './schema';

const splitLongTextByLength = (inputString: string, length = 3000) => {
  const chunks = [];
  for (let i = 0; i < inputString.length; i += length) {
    chunks.push(inputString.slice(i, i + length));
  }
  return chunks.filter((c) => !!c);
};

const getPartialSummary = async (
  input: string,
  env: Bindings
): Promise<string> => {
  const splittedInputs = splitLongTextByLength(input);

  let partialSummary = '';
  for (const input of splittedInputs) {
    const output = await getSummary(input, env);
    partialSummary += `${output}\n\n`;
  }

  return partialSummary;
};

export default getPartialSummary;
