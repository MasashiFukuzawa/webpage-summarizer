import { z } from 'zod';

export type Bindings = {
  GPT_MODEL: string;
  OPENAI_API_KEY: string;
  OPENAI_BASE_URL: string;
  USERNAME: string;
  PASSWORD: string;
};

const choices = z.array(
  z.object({
    index: z.number(),
    message: z.object({
      role: z.string(),
      content: z.string(),
    }),
    finish_reason: z.string(),
  })
);

const usage = z.object({
  prompt_tokens: z.number(),
  completion_tokens: z.number(),
  total_tokens: z.number(),
});

export const chatgptSchema = z.object({
  id: z.string(),
  object: z.string(),
  created: z.number(),
  choices,
  usage,
});
