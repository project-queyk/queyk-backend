import { eq } from "drizzle-orm";
import { Request } from "express";

import { db } from "../../drizzle";
import { TokenType } from "../schema";
import { token } from "../../drizzle/schema";

export async function verifyToken(req: Request, tokenType: TokenType) {
  const authHeader = req.headers.authorization;

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
      message: "No authorization header found",
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
      .where(eq(token.token, bearerToken));

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
  } catch (error) {}
}
