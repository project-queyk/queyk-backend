import { eq } from "drizzle-orm";
import { config } from "dotenv";
import { Request, Response } from "express";

import { db } from "../drizzle";
import { verifyToken } from "../lib/auth";
import { user } from "../drizzle/schema";
import { formatZodError } from "../lib/utils";
import { schoolEmailSchema } from "../lib/schema";
import { getUserByEmailAndOauthId } from "../lib/service/user-service";

config({ path: ".env.local" });

export async function createUser(req: Request, res: Response) {
  const { name, email, profileImage, oauthId } = req.body;

  const missingFields = [];
  if (!name) missingFields.push("name");
  if (!email) missingFields.push("email");
  if (!profileImage) missingFields.push("profileImage");
  if (!oauthId) missingFields.push("oauthId");

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
      message: formatZodError(isValidEmail.error),
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

export async function getAllUsers(req: Request, res: Response) {
  try {
    const isValidToken = await verifyToken(req);

    if (!isValidToken?.isValidToken) {
      return res.status(401).send({
        message: "Invalid or expired authentication token",
        error: "Unauthorized",
        statusCode: 401,
      });
    }

    const data = await db.select().from(user);

    if (!data.length) {
      return res.status(200).send({
        message: "No users found in the database",
        statusCode: 200,
        data: [],
      });
    }

    return res.status(200).send({
      message: "Users retrieved successfully",
      statusCode: 200,
      data,
    });
  } catch (error) {
    return res.status(500).send({
      message:
        error instanceof Error
          ? error.message
          : "There was an error retrieving users data.",
      error: "Internal Server Error",
      statusCode: 500,
    });
  }
}

export async function getUserByUserId(req: Request, res: Response) {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).send({
      message: "User ID is required",
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

    const [data] = await db.select().from(user).where(eq(user.id, userId));

    if (!data) {
      return res.status(404).send({
        message: "User not found",
        error: "Not Found",
        statusCode: 404,
      });
    }

    return res
      .status(200)
      .send({ message: "User found", statusCode: 200, data });
  } catch (error) {
    return res.status(500).send({
      message:
        error instanceof Error
          ? error.message
          : "There was an error retrieving the user data.",
      error: "Internal Server Error",
      statusCode: 500,
    });
  }
}

export async function toggleAlertNotification(req: Request, res: Response) {
  const { oauthId } = req.params;
  const { alertNotification } = req.body;

  if (!oauthId) {
    return res.status(400).send({
      message: "OAuth ID is required",
      error: "Bad Request",
      statusCode: 400,
    });
  }

  if (typeof alertNotification !== "boolean") {
    return res.status(400).send({
      message: "alertNotification must be a boolean value",
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

    const [userExists] = await db
      .select()
      .from(user)
      .where(eq(user.oauthId, oauthId));

    if (!userExists) {
      return res.status(404).send({
        message: "User not found",
        error: "Not Found",
        statusCode: 404,
      });
    }

    const [updatedUser] = await db
      .update(user)
      .set({ alertNotification })
      .where(eq(user.oauthId, oauthId))
      .returning();

    if (!updatedUser) {
      return res.status(404).send({
        message: "Failed to update notification preferences",
        error: "Update Failed",
        statusCode: 404,
      });
    }

    return res.status(200).send({
      message: `Alert notifications ${
        alertNotification ? "enabled" : "disabled"
      } successfully`,
      statusCode: 200,
      data: { alertNotification: updatedUser.alertNotification },
    });
  } catch (error) {
    return res.status(500).send({
      message:
        error instanceof Error
          ? `Error updating notification preferences: ${error.message}`
          : "An unexpected error occurred while updating notification preferences",
      error: "Internal Server Error",
      statusCode: 500,
    });
  }
}
