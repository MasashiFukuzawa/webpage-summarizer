import { Bindings, chatgptSchema } from './schema';

const prompt = (input: string) => {
  return `# Instruction
Summarize the input text (a document in Markdown format) according to the following constraints:
Emphasize the headings, bolded text, and bulleted points as they are particularly important. Focus on summarizing these key elements.
Feel free to ignore less important sentences.

# Constraints
- Keep the summary within 300 characters.
- Output the summary in Japanese.
- If the content is a meaningless list of strings or does not form a coherent summary, it is okay not to output anything.

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
