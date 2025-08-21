import { z } from "zod/v4";

const schoolDomain = process.env.SCHOOL_EMAIL_ADDRESS ?? "@school.edu";

export const schoolEmailSchema = z
  .email()
  .refine((email) => email.endsWith(schoolDomain), {
    message: `Email must belong to the school's domain (${schoolDomain}). Example: "alice${schoolDomain}"`,
  });

export const roleUnion = [z.literal("user"), z.literal("admin")];

export const tokenTypeUnion = [
  z.literal("auth"),
  z.literal("admin"),
  z.literal("user"),
  z.literal("iot"),
];

export type TokenType = z.infer<typeof tokenTypeUnion>;

export const userSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.email(),
  profileImage: z.string(),
  alertNotification: z.boolean(),
  createdAt: z.date(),
  role: z.union(roleUnion),
  oauthId: z.string(),
});

export type User = z.infer<typeof userSchema>;

export const tokenSchema = z.object({
  id: z.uuid(),
  type: z.union(tokenTypeUnion),
  token: z.string(),
  createdAt: z.date(),
  expiresAt: z.nullish(z.date()),
});

export type Token = z.infer<typeof tokenSchema>;
