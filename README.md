## Automating Jira Ticket Updates from GitHub Push Events

### By Emiliano Roberti

---

# 📖 Overview

This document details how to implement a system that listens to **GitHub Push Events**, extracts **Jira ticket references** from commit messages, and automatically updates the referenced ticket in **Jira Cloud** by posting a comment with commit details.

---

# 🛠️ Complete Architecture

1. **GitHub Webhook** triggers on `push` events.
2. **Express.js Server** receives the webhook payload.
3. **Signature Verification** secures the endpoint.
4. **Payload Parsing** extracts commit information.
5. **Jira API Integration** posts a structured comment to the referenced Jira ticket.

---

# 🗂️ Project Structure

```
/project-root
  ├── src/
  │    ├── app/jira/JiraHandler.ts
  │    ├── auth/auth.ts
  │    ├── models/pushModel.ts
  │    ├── routes/githubRoute.ts
  │    ├── env.ts
  │    └── server.ts
  ├── .env
  └── package.json
```

---

# 🔐 Environment Variables

```
GITHUB_TOKEN=your_github_token
GITHUB_SECRET=your_github_webhook_secret
OPENAI_API_KEY=your_openai_api_key
REPO_NAME=your_repo_name
REPO_OWNER=your_repo_owner
ANTHROPIC_API_KEY=your_anthropic_api_key
JIRA_API_TOKEN=your_jira_api_token
JIRA_BASE_URL=https://your-domain.atlassian.net
JIRA_PROJECT_KEY=MFLP
JIRA_USER_EMAIL=your-email@yourcompany.com
PORT=3000
```

---

# ⚙️ GitHub Webhook Configuration

1. Go to **GitHub Repository Settings > Webhooks > Add Webhook**.
2. Set Payload URL to `/push` endpoint.
3. Set Content type to `application/json`.
4. Add the Webhook Secret.
5. Select `push` events.

---

# 🛡️ Signature Verification (src/auth/auth.ts)

```typescript
import crypto from "crypto";

export function verifySigniture(payload: string, signature: string): boolean {
  const hmac = crypto.createHmac("sha256", process.env.GITHUB_SECRET!);
  const digest = `sha256=${hmac.update(payload).digest("hex")}`;
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}
```

---

# 🧑‍💻 Full Code Details

## 1. Environment Loader (src/env.ts)

```typescript
import dotenv from "dotenv";
dotenv.config();

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
```

---

## 2. Webhook Route (src/routes/githubRoute.ts)

```typescript
import Router, { Request, Response } from "express";
import { verifySigniture } from "../auth/auth.js";
import { postJiraComment } from "../app/jira/JiraHandler.js";

export const githubRouter = Router();

githubRouter.post("/push", async (req: Request, res: Response) => {
  const signiture = req.headers["x-hub-signature-256"] as string;
  const rawBody = (req as any).rawBody;

  if (!signiture || !verifySigniture(rawBody, signiture)) {
    return res
      .status(500)
      .json({ success: false, message: "Signature verification failed" });
  }

  const payload = JSON.parse(req.body.payload);
  const headCommit = payload.head_commit;
  const message = headCommit.message;
  const jiraTicket = extractValidatedJiraTicket(message);

  if (jiraTicket) {
    const commitSummary = JSON.stringify(payload, null, 2);
    await postJiraComment(jiraTicket, commitSummary);
  }

  return res.status(200).json({ success: true });
});
```

---

## 3. Jira API Integration (src/app/jira/JiraHandler.ts)

```typescript
import axios from "axios";
import { JIRA_API_TOKEN, JIRA_BASE_URL, JIRA_USER_EMAIL } from "../../env.js";

export async function postJiraComment(issueKey: string, message: string) {
  const jiraApiUrl = `${JIRA_BASE_URL}/rest/api/3/issue/${issueKey}/comment`;

  const payload = {
    body: {
      type: "doc",
      version: 1,
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: message }],
        },
      ],
    },
  };

  const response = await axios.post(jiraApiUrl, payload, {
    auth: { username: JIRA_USER_EMAIL, password: JIRA_API_TOKEN },
    headers: { Accept: "application/json", "Content-Type": "application/json" },
  });

  console.log("Jira comment posted:", response.data);
}
```

---

## 4. Jira Ticket Extractor (src/routes/githubRoute.ts)

```typescript
function extractValidatedJiraTicket(message: string): string | null {
  const match = message.match(/\[jira:([A-Z]{2,}-\d+)\]/i);
  return match ? match[1].toUpperCase() : null;
}
```

---

# ✅ Usage Example

Commit message:

```
Fixed auth bug [jira:MFLP-567]
```

Results in a Jira comment on ticket **MFLP-567** with the push details.

---

# 🚀 Run the Project

1. Install dependencies:

```bash
npm install
```

2. Create your `.env` file with all required variables.

3. Start the server:

```bash
npm start
```

4. Push a commit that references a Jira ticket using `[jira:PROJECTKEY-123]`.

5. Confirm that the Jira ticket receives the commit summary as a comment.

---

# ✅ Team Benefits

- **Developers**: Effortless ticket linking by following commit message conventions.
- **Scrum Masters**: Real-time tracking of delivery against Jira tickets.
- **Managers**: Enhanced traceability and reporting.

---

# 📝 Conclusion

By integrating GitHub push events with Jira, we achieve:

- Reduced manual updates.
- Improved team visibility.
- Better delivery traceability.

This solution empowers teams to work smarter, not harder.

---

_Authored by Emiliano Roberti – Senior Solution Architect_
