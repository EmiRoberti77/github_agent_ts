import Router, { Request, Response } from "express";
import { verifySigniture } from "../auth/auth.js";
import { PushModel } from "../models/pushModel.js";
import { postJiraComment } from "../jira/JiraHandler.js";

export const githubRouter = Router();
enum PATH {
  push = "/push",
}

githubRouter.post(
  PATH.push,
  async (req: Request, res: Response): Promise<any> => {
    console.log(req.url);
    const signiture = req.headers["x-hub-signature-256"] as string;
    const rawBody = (req as any).rawBody;
    if (!signiture || !verifySigniture(rawBody, signiture)) {
      console.log("signiture veerification failed");
      return res.status(500).json({
        success: false,
        message: "Error:Signiture verification failed",
      });
    }
    const payload = JSON.parse(req.body.payload);
    const pushDetails = extractPushDetails(payload);
    const jiraTicket = extractValidatedJiraTicket(pushDetails.message);
    const commitSummary = JSON.stringify(pushDetails, null, 2);
    console.log(commitSummary);
    if (jiraTicket) await postJiraComment(jiraTicket, commitSummary);
    else console.log("Missing Jira Ticket name");
    return res.status(200).json({
      success: true,
    });
  }
);

/**
 * this functoin extracts the push details that have been
 * captured from the github webhook call
 * @param payload
 * @returns
 */
function extractPushDetails(payload: any): PushModel {
  const headCommit = payload.head_commit;
  const pushDetails: PushModel = {
    branch: payload.ref,
    headCommit: headCommit,
    message: headCommit.message,
    user: headCommit.committer.username,
    created: payload.created,
    removed: payload.removed,
    forced: payload.forced,
    timeStammp: headCommit.timeStammp,
  };
  return pushDetails;
}

/**
 * Extracts and validates Jira ticket keys in the format [jira:ABC-123]
 * - Project key: uppercase letters only, 2+ characters
 * - Number: one or more digits
 * Example valid: [jira:ABC-123]
 */
function extractValidatedJiraTicket(message: string): string | null {
  const match = message.match(/\[jira:([A-Z]{2,}-\d+)\]/i);
  return match ? match[1].toUpperCase() : null;
}
