import Router, { Request, Response } from "express";
import { verifySigniture } from "../auth/auth.js";
import { pushDetailsSchema, PushModel } from "../models/pushModel.js";
import { json } from "body-parser";
export const githubRouter = Router();
enum PATH {
  push = "/push",
}

githubRouter.post(PATH.push, (req: Request, res: Response): any => {
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
  console.log(JSON.stringify(pushDetails, null, 2));

  return res.status(200).json({
    success: true,
  });
});

function extractPushDetails(payload: any): PushModel {
  const headCommit = payload.head_commit;
  console.log("headCommit", headCommit);
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
