import { eq } from "drizzle-orm";

import { db } from "../../drizzle";
import { token } from "../../drizzle/schema";
import { Token, TokenType } from "../schema";

export async function getTokenByTokenType(
  tokenType: TokenType
): Promise<Token | null> {
  const [existingToken] = await db
    .select()
    .from(token)
    .where(eq(token.type, tokenType));

  if (!existingToken) return null;

  return existingToken;
}
