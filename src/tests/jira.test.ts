import { JiraHandler } from "../app/jira/JiraHandler.js";

describe("Jira integration test suite", () => {
  let jiraHandler: JiraHandler | undefined = undefined;
  beforeAll(() => {
    jiraHandler = new JiraHandler();
  });
  test("Jira integration test", async () => {
    const response = await jiraHandler?.createJiraTicket(
      "oaix-jest",
      "this is a ticket create by oaix"
    );
    expect(response).toBeDefined();
  });
});
