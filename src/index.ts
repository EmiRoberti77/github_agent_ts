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
  const { data } = await octokit.pulls.get({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    pull_number,
    mediaType: { format: 'diff' },
  });

  const diffUrl = data.diff_url;
  const diffResponse = await axios.get(diffUrl, {
    headers: { Authorization: `token ${GITHUB_TOKEN}` },
  });

  console.log('DIFF_URL', diffUrl);
  if (!diffUrl) {
    throw new Error('Error:diffUrl is undefined');
  }
  return diffResponse.data;
}

async function reviewWithOpenAI(diff: string) {
  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content:
            'You are a senior software engineer reviewing a GitHub pull request. Identify bugs, code smells, and improvement suggestions based on the diff provided.',
        },
        {
          role: 'user',
          content: `Here is the pull request diff:\n\n${diff}`,
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
  const review = await getPullRequestDiff(78);
  const response = await reviewWithOpenAI(review);
}

main();
