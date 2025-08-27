import { config } from "dotenv";
import { z } from "zod/v4";

config({ path: ".env.local" });

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

export const tokenTypeUnionSchema = z.union(tokenTypeUnion);

export type TokenType = z.infer<typeof tokenTypeUnionSchema>;

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

export const createUserSchema = userSchema.omit({
  id: true,
  role: true,
  createdAt: true,
  alertNotification: true,
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

export const readingSchema = z.object({
  id: z.uuid(),
  siAverage: z.number(),
  siMinimum: z.number(),
  siMaximum: z.number(),
  battery: z.number(),
  signalStrength: z.string(),
  createdAt: z.date(),
});

export type Reading = z.infer<typeof readingSchema>;

export const createReadingSchema = readingSchema.omit({
  id: true,
  createdAt: true,
});
