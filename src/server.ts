import express, { Request, Response } from "express";
import cors from "cors";
import bodyparser from "body-parser";
import { verifySigniture } from "./auth/auth.js";
const app = express();
app.use(cors());
//app.use(express.json());
//app.use(express.urlencoded({ extended: true }));
// Capture raw body for signature verification
app.use(
  bodyparser.urlencoded({
    extended: true,
    verify: (req, res, buf) => {
      (req as any).rawBody = buf.toString();
    },
  })
);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
  });
});

app.post("/oaix", (req: Request, res: Response): any => {
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

  console.log(req.body);
  return res.status(200).json({
    success: true,
  });
});

app.listen(3000, () => {
  console.log("listening");
});
