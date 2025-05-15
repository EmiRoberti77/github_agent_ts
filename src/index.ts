import { Octokit } from '@octokit/rest';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
const GITHUB_TOKEN = process.env.GITHUB_TOKEN!;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;
const REPO_NAME = process.env.REPO_NAME!;
const REPO_OWNER = process.env.REPO_OWNER!;
console.log(GITHUB_TOKEN);
console.log(OPENAI_API_KEY);
console.log(REPO_NAME);
console.log(REPO_OWNER);
const octokit = new Octokit({
  auth: GITHUB_TOKEN,
});

async function getPullRequestDiff(pull_number: number) {
  console.log(1);
  const response = await octokit.request(
    'GET /repos/{owner}/{repo}/pulls/{pull_number}',
    {
      owner: REPO_OWNER,
      repo: REPO_NAME,
      pull_number,
      headers: {
        accept: 'application/vnd.github.v3.diff',
      },
    }
  );
  console.log(response.data);
  return JSON.stringify(response.data) as string;
}
async function reviewCode(diff: string) {
  const PROMPT = 'ACTION: Review the code in this diff. --- DIFF:' + diff;
  return await callAI(PROMPT);
}

async function documentCode(diff: string) {
  const PROMPT =
    'ACTION: Provide documentation the code in this diff. --- DIFF:' + diff;
  return await callAI(PROMPT);
}

async function callAI(inputPrompt: string) {
  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content:
            'You are a senior software engineer reviewing a GitHub pull request. Identify bugs, code smells, documentation of code, improvement and suggestions based on the diff provided.',
        },
        {
          role: 'user',
          content: inputPrompt,
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data.choices[0].message.content;
}

async function main() {
  const review = await getPullRequestDiff(3);
  const response = await documentCode(review);
  console.log(response);
}

main();
