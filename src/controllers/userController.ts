import { config } from "dotenv";
import { Request, Response } from "express";

import { db } from "../drizzle";
import { verifyToken } from "../lib/auth";
import { user } from "../drizzle/schema";
import { schoolEmailSchema } from "../lib/schema";
import { getUserByEmailAndOauthId } from "../lib/service/user-service";

config({ path: ".env.local" });

export async function createUser(req: Request, res: Response) {
  const { name, email, profileImage, oauthId, tokenType } = req.body;

  const missingFields = [];
  if (!name) missingFields.push("name");
  if (!email) missingFields.push("email");
  if (!profileImage) missingFields.push("profileImage");
  if (!oauthId) missingFields.push("oauthId");
  if (!tokenType) missingFields.push("tokenType");

  if (missingFields.length > 0) {
    return res.status(400).send({
      message: `Missing required fields: ${missingFields.join(", ")}`,
      error: "Bad Request",
      statusCode: 400,
    });
  }

  const isValidEmail = schoolEmailSchema.safeParse(email);

  if (isValidEmail.error) {
    return res.status(400).send({
      message: isValidEmail.error.message,
      error: "Bad Request",
      statusCode: 400,
    });
  }

  try {
    const isValidToken = await verifyToken(req, tokenType);

    if (!isValidToken?.isValidToken) {
      return res.status(401).send({
        message: "Invalid or expired authentication token",
        error: "Unauthorized",
        statusCode: 401,
      });
    }

    const userExist = await getUserByEmailAndOauthId(email, oauthId);

    if (userExist) {
      return res.status(200).send({
        message: "User already exists",
        statusCode: 200,
        data: null,
      });
    }

    const newUserValues = {
      name,
      email,
      oauthId,
      profileImage,
    };

    const [newUser] = await db.insert(user).values(newUserValues).returning();

    return res.status(201).send({
      message: "User created successfully",
      statusCode: 201,
      data: null,
    });
  } catch (error) {
    return res.status(500).send({
      message:
        "An unexpected error occurred while creating the account. Please try again later. If the problem persists, contact support.",
      error: "Internal Server Error",
      statusCode: 500,
    });
  }
}
