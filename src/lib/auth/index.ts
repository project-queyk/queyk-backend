import { Request } from "express";
import { and, eq } from "drizzle-orm";

import { db } from "../../drizzle";
import { formatZodError } from "../utils";
import { token } from "../../drizzle/schema";
import { tokenTypeUnionSchema } from "../schema";

export async function verifyToken(req: Request) {
  const authHeader = req.headers.authorization;
  const tokenType = req.headers["token-type"];

  if (!authHeader) {
    return {
      isValidToken: false,
      message: "No authorization header found",
      error: "Unauthorized",
      statusCode: 401,
    };
  }

  if (!tokenType) {
    return {
      isValidToken: false,
      message: "No token type found in the headers",
      error: "Unauthorized",
      statusCode: 401,
    };
  }

  const isValidTokenType = tokenTypeUnionSchema.safeParse(tokenType);

  if (isValidTokenType.error) {
    return {
      isValidToken: false,
      message: formatZodError(isValidTokenType.error),
      error: "Unauthorized",
      statusCode: 401,
    };
  }

  if (!authHeader.startsWith("Bearer ")) {
    return {
      isValidToken: false,
      message: "Invalid authorization header format",
      error: "Unauthorized",
      statusCode: 401,
    };
  }

  const bearerToken = authHeader.substring(7);

  try {
    const [isAuthorized] = await db
      .select()
      .from(token)
      .where(
        and(eq(token.token, bearerToken), eq(token.type, isValidTokenType.data))
      );

    if (!isAuthorized) {
      return {
        isValidToken: false,
        message: "Invalid or expired token",
        error: "Unauthorized",
        statusCode: 401,
      };
    }

    return {
      isValidToken: true,
      message: "Token validated successfully",
      error: null,
      statusCode: 200,
    };
  } catch (error) {
    return {
      isValidToken: false,
      message:
        error instanceof Error ? error.message : "Invalid or expired token",
      error: "Unauthorized",
      statusCode: 401,
    };
  }
}
