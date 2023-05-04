import { Bindings, chatgptSchema } from './schema';

const prompt = (input: string): string => {
  return `# Instruction
  Please summarize the main points of the input statement in 5 lines. Each item should be summarized in 150 characters or less.
  If the input is in English, the output should be converted to Japanese.
  Note that the input text, although incomplete, is output in Markdown, especially the parts that correspond to the major items marked with \`#\`, the parts highlighted in bold, and the bulleted parts.

# Input
${input}

# Output`;
};

const getSummary = async (input: string, env: Bindings): Promise<string> => {
  const response = await fetch(`${env.OPENAI_BASE_URL}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: env.GPT_MODEL,
      messages: [{ role: 'user', content: prompt(input) }],
    }),
  });

  const json = await response.json();
  const parsed = chatgptSchema.safeParse(json);
  if (!parsed.success) {
    console.error(parsed.error);
    throw new Error('Failed to parse response.');
  }
  const output = parsed.data.choices[0].message.content;

  if (!output) {
    return 'No output.';
  }

  // TODO: Save output log into Cloudflare D1.
  console.log(output);

  return output;
};

export default getSummary;
