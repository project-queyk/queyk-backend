import { Request, Response } from "express";

import { db } from "../drizzle";
import { reading } from "../drizzle/schema";
import { verifyToken } from "../lib/auth";
import { formatZodError } from "../lib/utils";
import { createReadingSchema } from "../lib/schema";

export async function createReading(req: Request, res: Response) {
  const {
    siAverage,
    siMinimum,
    siMaximum,
    isEarthquake,
    battery,
    signalStrength,
  } = req.body;

  const missingFields = [];
  if (siAverage == null) missingFields.push("siAverage");
  if (siMinimum == null) missingFields.push("siMinimum");
  if (siMaximum == null) missingFields.push("siMaximum");
  if (isEarthquake == null) missingFields.push("isEarthquake");
  if (battery == null) missingFields.push("battery");
  if (signalStrength == null) missingFields.push("signalStrength");

  if (missingFields.length > 0) {
    return res.status(400).send({
      message: `Missing required fields: ${missingFields.join(", ")}`,
      error: "Bad Request",
      statusCode: 400,
    });
  }

  const readingValues = {
    siAverage,
    siMinimum,
    siMaximum,
    isEarthquake,
    battery,
    signalStrength,
  };

  const isValidReadingValues = createReadingSchema.safeParse(readingValues);

  if (isValidReadingValues.error) {
    return res.status(400).send({
      message: formatZodError(isValidReadingValues.error),
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

    const [newReading] = await db
      .insert(reading)
      .values(isValidReadingValues.data)
      .returning();

    if (!newReading) {
      return res.status(500).send({
        message: "Failed to create reading",
        error: "Internal Server Error",
        statusCode: 500,
      });
    }

    return res.status(201).send({
      message: "Reading created successfully",
      statusCode: 201,
      data: newReading,
    });
  } catch (error) {
    return res.status(500).send({
      message:
        "An unexpected error occurred while creating the reading. Please try again later. If the problem persists, contact support.",
      error: "Internal Server Error",
      statusCode: 500,
    });
  }
}
