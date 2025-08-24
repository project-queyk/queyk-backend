import { nanoid } from "nanoid";
import { Request, Response } from "express";

import { db } from "../drizzle";
import { token } from "../drizzle/schema";
import { verifyToken } from "../lib/auth";
import { formatZodError } from "../lib/utils";
import { tokenTypeUnionSchema } from "../lib/schema";
import { getTokenByTokenType } from "../lib/service/token-service";

export async function createToken(req: Request, res: Response) {
  const { tokenType } = req.body;

  if (!tokenType) {
    return res.status(400).send({
      message: "Missing required tokenType field",
      error: "Bad Request",
      statusCode: 400,
    });
  }

  const isValidTokenType = tokenTypeUnionSchema.safeParse(tokenType);

  if (isValidTokenType.error) {
    return res.status(400).send({
      message: formatZodError(isValidTokenType.error),
      error: "Bad Request",
      statusCode: 400,
    });
  }

  try {
    const isValidToken = await verifyToken(req);

    if (!isValidToken?.isValidToken) {
      return res.status(401).send({
        message: "Invalid or expired authentication token",
        error: "Unauthorized",
        statusCode: 401,
      });
    }

    const existingTokenWithSameTokenType = await getTokenByTokenType(tokenType);

    if (existingTokenWithSameTokenType) {
      return res.status(409).send({
        message: `A token with type '${tokenType}' already exists`,
        error: "Conflict",
        statusCode: 409,
      });
    }

    const newTokenValues = {
      token: nanoid(),
      type: tokenType,
    };

    const [newToken] = await db
      .insert(token)
      .values(newTokenValues)
      .returning();

    if (!newToken) {
      return res.status(500).send({
        message: "Failed to create token",
        error: "Internal Server Error",
        statusCode: 500,
      });
    }

    return res.status(201).send({
      message: "Token created successfully",
      statusCode: 201,
      data: newToken,
    });
  } catch (error) {
    return res.status(500).send({
      message:
        "An unexpected error occurred while creating the token. Please try again later. If the problem persists, contact support.",
      error: "Internal Server Error",
      statusCode: 500,
    });
  }
}
