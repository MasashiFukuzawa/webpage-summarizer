const OPENAI_BASE_URL = 'https://api.openai.com';
const OPENAI_API_KEY =
  PropertiesService.getScriptProperties().getProperty('OPENAI_API_KEY')!;

const buildPrompt = (prompt: Prompt, input: string) => {
  return `# 命令
${prompt.instruction}

# 制約条件
${prompt.constraints}

# 入力文
${input}

# 出力文

`;
};

const requestToChatGPT = (prompt: Prompt, input: string): string => {
  const response = UrlFetchApp.fetch(`${OPENAI_BASE_URL}/v1/chat/completions`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    payload: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: buildPrompt(prompt, input) }],
    }),
    muteHttpExceptions: true,
  });

  if (response.getResponseCode() !== 200) {
    return `Error: status=${response.getResponseCode()} response=${response.getContentText()}`;
  }

  const responseObject: ChatgptResponse = JSON.parse(response.getContentText());
  const output = responseObject.choices[0].message.content;

  if (!output) {
    return 'No output.';
  }

  return output;
};
