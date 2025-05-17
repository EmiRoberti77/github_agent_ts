import { z } from "zod";
export const CommitSchema = z.object({
  id: z.string(),
  tree_id: z.string(),
  distinct: z.boolean(),
  message: z.string(),
  timestamp: z.string(),
  url: z.string().url(),
  author: z.object({
    name: z.string(),
    email: z.string().email(),
    username: z.string(),
  }),
  committer: z.object({
    name: z.string(),
    email: z.string().email(),
    username: z.string(),
  }),
  added: z.array(z.string()),
  removed: z.array(z.string()),
  modified: z.array(z.string()),
});

export const CommitsArraySchema = z.array(CommitSchema);

export const HeadCommitSchema = z.object({
  id: z.string().optional(),
  tree_id: z.string().optional(),
  distinct: z.boolean().optional(),
  message: z.string(),
  timestamp: z.string(),
  url: z.string().url().optional(),
  author: z
    .object({
      name: z.string(),
      email: z.string().email(),
      username: z.string(),
    })
    .optional(),
  committer: z
    .object({
      name: z.string(),
      email: z.string().email(),
      username: z.string(),
    })
    .optional(),
  added: z.array(z.string()).optional(),
  removed: z.array(z.string()).optional(),
  modified: z.array(z.string()).optional(),
});

export const pushDetailsSchema = z.object({
  branch: z.string(),
  headCommit: HeadCommitSchema,
  user: z.string(),
  message: z.string(),
  removed: z.string(),
  created: z.boolean(),
  forced: z.boolean(),
  timeStammp: z.string(),
});

export type PushModel = z.infer<typeof pushDetailsSchema>;
