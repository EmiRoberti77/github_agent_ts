import dotenv from "dotenv";
dotenv.config();
/**
 * extract all the enviroment variables
 */
export const GITHUB_TOKEN = process.env.GITHUB_TOKEN!;
export const GITHUB_SECRET = process.env.GITHUB_SECRET!;
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;
export const REPO_NAME = process.env.REPO_NAME!;
export const REPO_OWNER = process.env.REPO_OWNER!;
export const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY!;
export const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN!;
export const JIRA_BASE_URL = process.env.JIRA_BASE_URL!;
export const JIRA_PROJECT_KEY = process.env.JIRA_PROJECT_KEY!;
export const JIRA_USER_EMAIL = process.env.JIRA_USER_EMAIL!;
export const PORT = parseInt(process.env.PORT!);
/**
 * System prompts
 */
export const AI_INIT_SYSTEM_PROMPT =
  "You are a senior software engineer reviewing a GitHub pull request. Identify bugs, code smells, documentation of code, improvement and suggestions based on the diff provided.";
