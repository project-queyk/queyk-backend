import { eq, asc } from "drizzle-orm";
import { Request, Response } from "express";

import { db } from "../drizzle";
import { reading } from "../drizzle/schema";
import { verifyToken } from "../lib/auth";
import { formatZodError } from "../lib/utils";
import { createReadingSchema } from "../lib/schema";
import {
  getAllReadings,
  getAllStartEndReadings,
  getBatteryLevel,
  getFirstDataDate,
} from "../lib/service/reading-service";
import generateResponse from "../lib/service/gemini";

const systemInstruction = `You are a seismic monitoring AI assistant for earthquake detection and analysis. Based on the seismic intensity (SI) readings provided, generate a concise professional summary that includes:
- Current seismic activity level assessment
- Risk evaluation based on SI values (normal: <0.5, elevated: 0.5-1.0, concerning: >1.0)
- Notable patterns or anomalies in the data
- Brief safety recommendations if applicable
Keep response under 150 words and maintain a calm, informative tone.
IMPORTANT: Convert all UTC times to Philippine Time (UTC+8) when displaying dates and times in your response. Display times in 12-hour format like "04:00 PM" without mentioning "Philippine Time" or timezone.`;

export async function createReading(req: Request, res: Response) {
  const { siAverage, siMinimum, siMaximum, battery, signalStrength } = req.body;

  const missingFields = [];
  if (siAverage == null) missingFields.push("siAverage");
  if (siMinimum == null) missingFields.push("siMinimum");
  if (siMaximum == null) missingFields.push("siMaximum");
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

export async function getReadings(req: Request, res: Response) {
  const { startDate, endDate } = req.query;

  try {
    const isValidToken = await verifyToken(req);

    if (!isValidToken?.isValidToken) {
      return res.status(401).send({
        message: "Invalid or expired authentication token",
        error: "Unauthorized",
        statusCode: 401,
      });
    }

    if (startDate && endDate) {
      const start = new Date(startDate as string);
      const end = new Date(endDate as string);

      // start.setHours(0, 0, 0, 0);

      // end.setHours(23, 59, 59, 999);

      const firstDate = await getFirstDataDate();

      const batteryLevel = await getBatteryLevel();

      const readings = await getAllStartEndReadings(start, end);

      const startDateStr = (startDate as string).split("T")[0];
      const endDateStr = (endDate as string).split("T")[0];

      const formattedStartDate = new Date(
        startDateStr + "T00:00:00+08:00"
      ).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "Asia/Manila",
      });
      const formattedEndDate = new Date(
        endDateStr + "T00:00:00+08:00"
      ).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "Asia/Manila",
      });

      const prompt = `Analyze these seismic readings from ${formattedStartDate} to ${formattedEndDate}:
${JSON.stringify(readings, null, 2)}
Battery level: ${batteryLevel?.battery || "Unknown"}%`;

      const aiSummary = await generateResponse(prompt, systemInstruction);

      return res.status(200).send({
        message: "Readings retrieved successfully",
        statusCode: 200,
        data: readings,
        firstDate: firstDate?.firstDate,
        batteryLevel: batteryLevel?.battery,
        aiSummary: aiSummary.text,
      });
    }

    const readings = await getAllReadings();

    return res.status(200).send({
      message: "Readings retrieved successfully",
      statusCode: 200,
      data: readings,
    });
  } catch (error) {
    return res.status(500).send({
      message:
        "An unexpected error occurred while getting all the readings. Please try again later. If the problem persists, contact support.",
      error: "Internal Server Error",
      statusCode: 500,
    });
  }
}

export async function getReading(req: Request, res: Response) {
  const { readingId } = req.params;

  if (!readingId) {
    return res.status(400).send({
      message: "Reading ID is required",
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

    const [data] = await db
      .select()
      .from(reading)
      .where(eq(reading.id, readingId));

    if (!data) {
      return res.status(404).send({
        message: "Reading with the specified ID could not be found",
        error: "Not Found",
        statusCode: 404,
      });
    }

    return res.status(200).send({
      message: "Reading retrieved successfully",
      statusCode: 200,
      data,
    });
  } catch (error) {
    return res.status(500).send({
      message:
        "An unexpected error occurred while getting the reading. Please try again later. If the problem persists, contact support.",
      error: "Internal Server Error",
      statusCode: 500,
    });
  }
}
