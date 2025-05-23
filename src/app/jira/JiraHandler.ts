import axios from "axios";
import {
  JIRA_API_TOKEN,
  JIRA_BASE_URL,
  JIRA_PROJECT_KEY,
  JIRA_USER_EMAIL,
} from "../env.js";
import { kind } from "openai/_shims/index.mjs";

export class JiraHandler {
  constructor() {}

  async createJiraTicket(title: string, description: string): Promise<any> {
    const response = await axios.post(
      `${JIRA_BASE_URL}/rest/api/3/issue`,
      {
        fields: {
          project: { key: JIRA_PROJECT_KEY },
          summary: title,
          description: {
            type: "doc",
            version: 1,
            content: [
              {
                type: "paragraph",
                content: [{ text: description, type: "text" }],
              },
            ],
          },
          issuetype: { id: "10001" },
        },
      },
      {
        auth: { username: JIRA_USER_EMAIL, password: JIRA_API_TOKEN },
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200 || response.status === 201) {
      console.log("ticket created");
      return response.data.key;
    } else console.log(`ticket failed to created (status=${response.status})`);
    return "_empty";
  }
}

export async function postJiraComment(issueKey: string, message: string) {
  const jiraApiUrl = `${JIRA_BASE_URL}/rest/api/3/issue/${issueKey}/comment`;
  const jiraEmail = JIRA_USER_EMAIL;
  const jiraApiToken = JIRA_API_TOKEN;

  const payload = {
    body: {
      type: "doc",
      version: 1,
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: message,
            },
          ],
        },
      ],
    },
  };

  const response = await axios.post(jiraApiUrl, payload, {
    auth: { username: jiraEmail, password: jiraApiToken },
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  console.log("Jira comment posted:", response.data);
}
