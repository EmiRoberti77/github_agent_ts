import dotenv from 'dotenv';
dotenv.config();
export const GITHUB_TOKEN = process.env.GITHUB_TOKEN!;
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;
export const REPO_NAME = process.env.REPO_NAME!;
export const REPO_OWNER = process.env.REPO_OWNER!;
export const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY!;
export const AI_INIT_SYSTEM_PROMPT =
  'You are a senior software engineer reviewing a GitHub pull request. Identify bugs, code smells, documentation of code, improvement and suggestions based on the diff provided.';
