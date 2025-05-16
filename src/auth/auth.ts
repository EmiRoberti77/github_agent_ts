import crypto from "crypto";
import { GITHUB_SECRET } from "../env.js";
export function verifySigniture(rowBody: string, signiture: string) {
  console.log("verifySigniture");
  console.log(signiture);
  const expectedSigniture =
    "sha256=" +
    crypto.createHmac("sha256", GITHUB_SECRET).update(rowBody).digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(expectedSigniture),
    Buffer.from(signiture)
  );
}
