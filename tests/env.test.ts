import dotenv from "dotenv";

// Load .env variables
dotenv.config();

describe("env test suite", () => {
  test(".env file has all required variables", () => {
    const requiredEnvVars = [
      "GITHUB_TOKEN",
      "GITHUB_SECRET",
      "OPENAI_API_KEY",
      "REPO_NAME",
      "REPO_OWNER",
      "ANTHROPIC_API_KEY",
      "JIRA_API_TOKEN",
      "JIRA_BASE_URL",
      "JIRA_PROJECT_KEY",
      "JIRA_USER_EMAIL",
    ];

    requiredEnvVars.forEach((key) => {
      const value = process.env[key];
      expect(value).toBeDefined();
      expect(value).not.toEqual("");
    });
  });
});
