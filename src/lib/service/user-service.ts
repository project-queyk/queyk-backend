import { and, eq } from "drizzle-orm";

import { db } from "../../drizzle";
import { User } from "../schema";
import { user } from "../../drizzle/schema";

export async function getUserByEmailAndOauthId(
  email: string,
  oauthId: string
): Promise<User | null> {
  const [foundUser] = await db
    .select()
    .from(user)
    .where(and(eq(user.oauthId, oauthId), eq(user.email, email)));

  if (!foundUser) return null;

  return {
    ...foundUser,
    isInSchool: foundUser.isInSchool ?? false,
  };
}
