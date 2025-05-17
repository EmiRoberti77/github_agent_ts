import axios from "axios";
import {
  JIRA_API_TOKEN,
  JIRA_BASE_URL,
  JIRA_PROJECT_KEY,
  JIRA_USER_EMAIL,
} from "../env.js";

export class JiraHandler {
  constructor() {}

  async createJiraTicket(title: string, description: string) {
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
          issuetype: { name: "Bug" },
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
    return response.data.key;
  }
}
