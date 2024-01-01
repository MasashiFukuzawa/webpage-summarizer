const OPENAI_BASE_URL = 'https://api.openai.com';
const OPENAI_API_KEY =
  PropertiesService.getScriptProperties().getProperty('OPENAI_API_KEY')!;
const MAX_RETRY_COUNT = 3;
const RETRY_STATUS_CODES = [429, 500, 502, 503, 504];

const buildContent = (prompt: Prompt, input: string) => {
  return `# 命令
${prompt.instruction}

# 制約条件
${prompt.constraints}

# 入力文
${input}

# 出力文

`;
};

const errorMessage = (status: number, response: string): string => {
  return `Failed to request to ChatGPT. status: ${status}, response: ${response}`;
};

const requestToChatGPT = (prompt: Prompt, input: string): string => {
  let retryCount = 0;

  while (true) {
    const response = UrlFetchApp.fetch(
      `${OPENAI_BASE_URL}/v1/chat/completions`,
      {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        payload: JSON.stringify({
          model: 'gpt-4-1106-preview',
          messages: [{ role: 'user', content: buildContent(prompt, input) }],
        }),
        muteHttpExceptions: true,
      }
    );

    PropertiesService.getScriptProperties().setProperty(
      'lastExecution',
      new Date().toString()
    );

    const status = response.getResponseCode();
    const rawResponse = response.getContentText();
    const responseObject: ChatgptResponse = JSON.parse(rawResponse);

    if (retryCount >= MAX_RETRY_COUNT) {
      return errorMessage(status, rawResponse);
    }

    if (RETRY_STATUS_CODES.includes(status)) {
      retryCount++;
      // exponential backoff (20s -> 40s -> 90s)
      Utilities.sleep(retryCount ** 2 * 10 * 1000);
      continue;
    }

    if (status !== 200) {
      throw new Error(errorMessage(status, rawResponse));
    }

    const output = responseObject.choices[0].message.content;

    if (!output) {
      return 'No output.';
    }

    return output;
  }
};
