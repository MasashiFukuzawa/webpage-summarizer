type Summary = {
  content: string;
  summary: string;
  url: string;
  date: string;
  rowNum: number;
};

type SummaryData = {
  rows: Summary[];
  summarySheet: GoogleAppsScript.Spreadsheet.Sheet;
  lastColumn: number;
};

type Prompt = {
  instruction: string;
  constraints: string;
};

type Message = {
  role: string;
  content: string;
};

type Choice = {
  index: number;
  message: Message;
  finish_reason: number;
};

type Usage = {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
};

type ChatgptResponse = {
  id: string;
  object: string;
  created: number;
  choices: Choice[];
  usage: Usage;
};

type ParserAPIResponse = {
  markdown: string;
};
