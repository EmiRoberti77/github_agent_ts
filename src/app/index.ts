import { Octokit } from '@octokit/rest';
import { GITHUB_TOKEN, REPO_NAME, REPO_OWNER } from './env.js';
import { AI_INSTANCE, AIFactory } from './ai/llm/AIFactory.js';

const octokit = new Octokit({
  auth: GITHUB_TOKEN,
});

async function getPullRequestDiff(pull_number: number) {
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
  return JSON.stringify(response.data) as string;
}
async function reviewCode(diff: string) {
  const PROMPT = 'ACTION: Review the code in this diff. --- DIFF:' + diff;
  const agent = AIFactory.createAIInstance(AI_INSTANCE.OPENAI);
  return await agent.callAI(PROMPT);
}

async function documentCode(diff: string) {
  const PROMPT =
    'ACTION: Provide documentation the code in this diff. --- DIFF:' + diff;
  const agent = AIFactory.createAIInstance(AI_INSTANCE.ANTHROPIC);
  return await agent.callAI(PROMPT);
}

async function main() {
  const review = await getPullRequestDiff(3);
  const response = await documentCode(review);
  console.log(response);
}

main();
