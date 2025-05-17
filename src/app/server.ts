import express, { Request, Response } from "express";
import cors from "cors";
import bodyparser from "body-parser";
import { githubRouter } from "./routes/githubRoute.js";
import { ROUTE_PATHS } from "./routes/routePaths.js";
import { PORT } from "./env.js";
import { isoNow } from "./util/index.js";
const app = express();
app.use(cors());
//app.use(express.json());
//app.use(express.urlencoded({ extended: true }));
// Capture raw body for signature verification
const LISTENING = "listening";
enum PATH {
  HOME = "/",
}
app.use(
  bodyparser.urlencoded({
    extended: true,
    verify: (req, res, buf) => {
      (req as any).rawBody = buf.toString();
    },
  })
);

app.use(githubRouter);
app.use(ROUTE_PATHS.GITHUB, githubRouter);

app.get(PATH.HOME, (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
  });
});

app.listen(PORT, () => {
  console.log(PORT, LISTENING, isoNow());
});
