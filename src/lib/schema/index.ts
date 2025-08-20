import { z } from "zod/v4";

export const roleUnion = [z.literal("user"), z.literal("admin")];

export const userSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.email(),
  profileImage: z.string(),
  alertNotification: z.boolean(),
  createdAt: z.date(),
  role: z.union(roleUnion),
});

export type User = z.infer<typeof userSchema>;

export const tokenSchema = z.object({
  id: z.uuid(),
  type: z.string(),
  token: z.string(),
  createdAt: z.date(),
  expiresAt: z.nullish(z.date()),
});

export type Token = z.infer<typeof tokenSchema>;
