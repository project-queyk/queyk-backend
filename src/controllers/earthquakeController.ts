import { eq } from "drizzle-orm";
import { Request, Response } from "express";

import { db } from "../drizzle";
import { earthquake } from "../drizzle/schema";
import { verifyToken } from "../lib/auth";
import { formatZodError } from "../lib/utils";
import { createEarthquakeSchema } from "../lib/schema";
import {
  getAllEarthquakes,
  getAllStartEndEarthquakes,
} from "../lib/service/earthquake-service";
import generateResponse from "../lib/service/gemini";

const systemInstruction = `You are an earthquake monitoring AI assistant for seismic analysis and historical data interpretation. Based on the earthquake records provided, generate a concise professional summary that includes:
- Historical earthquake activity assessment
- Analysis of magnitude patterns and frequency
- Notable trends or clusters in earthquake occurrences
- Risk evaluation and safety insights based on historical data
Keep response under 150 words and maintain a calm, informative tone.
IMPORTANT: Convert all UTC times to Philippine Time (UTC+8) when displaying dates and times in your response. Display times in 12-hour format (e.g., "04:00 AM" or "04:00 PM") without mentioning "Philippine Time" or timezone. Be careful with AM/PM conversion - double-check that morning hours show AM and afternoon/evening hours show PM.`;

export async function createEarthquake(req: Request, res: Response) {
  const { magnitude, duration } = req.body;

  const missingFields = [];
  if (magnitude == null) missingFields.push("magnitude");
  if (duration == null) missingFields.push("duration");

  if (missingFields.length > 0) {
    return res.status(400).send({
      message: `Missing required fields: ${missingFields.join(", ")}`,
      error: "Bad Request",
      statusCode: 400,
    });
  }

  const earthquakeValues = {
    magnitude,
    duration,
  };

  const isValidEarthquakeValues =
    createEarthquakeSchema.safeParse(earthquakeValues);

  if (isValidEarthquakeValues.error) {
    return res.status(400).send({
      message: formatZodError(isValidEarthquakeValues.error),
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

    const [newEarthquake] = await db
      .insert(earthquake)
      .values(isValidEarthquakeValues.data)
      .returning();

    if (!newEarthquake) {
      return res.status(500).send({
        message:
          "The earthquake record could not be created in the database. Please try again.",
        error: "Database Operation Failed",
        statusCode: 500,
      });
    }

    return res.status(201).send({
      message:
        "Earthquake record successfully created and stored in the database",
      statusCode: 201,
      data: newEarthquake,
    });
  } catch (error) {
    return res.status(500).send({
      message:
        "An unexpected error occurred while creating the earthquake record. Please try again later. If the problem persists, contact support.",
      error: "Internal Server Error",
      statusCode: 500,
    });
  }
}

export async function getEarthquakes(req: Request, res: Response) {
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

      start.setHours(-8, 0, 0, 0);
      end.setHours(15, 59, 59, 999);

      const earthquakes = await getAllStartEndEarthquakes(start, end);

      let prompt;
      if (earthquakes && earthquakes.length > 0) {
        const dates = earthquakes.map((e) => new Date(e.createdAt));
        const actualStartDate = new Date(
          Math.min(...dates.map((d) => d.getTime()))
        );
        const actualEndDate = new Date(
          Math.max(...dates.map((d) => d.getTime()))
        );

        const actualFormattedStart = actualStartDate.toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          }
        );
        const actualFormattedEnd = actualEndDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        prompt = `Analyze these earthquake records from ${actualFormattedStart} to ${actualFormattedEnd}:
${JSON.stringify(earthquakes, null, 2)}`;
      } else {
        prompt = `No earthquake records found for the requested period.`;
      }

      let aiSummary;
      try {
        aiSummary = await generateResponse(prompt, systemInstruction);
      } catch (error: any) {
        if (error.status === 429) {
          aiSummary =
            "AI analysis is temporarily unavailable due to high demand. Please try again later.";
        } else {
          aiSummary = "AI analysis is currently unavailable.";
        }
      }

      return res.status(200).send({
        message: "Earthquake record retrieved successfully",
        statusCode: 200,
        data: earthquakes,
        aiSummary: typeof aiSummary === "string" ? aiSummary : aiSummary.text,
      });
    }

    const earthquakes = await getAllEarthquakes();

    let prompt;
    if (earthquakes && earthquakes.length > 0) {
      const dates = earthquakes.map((e) => new Date(e.createdAt));
      const actualStartDate = new Date(
        Math.min(...dates.map((d) => d.getTime()))
      );
      const actualEndDate = new Date(
        Math.max(...dates.map((d) => d.getTime()))
      );

      const actualFormattedStart = actualStartDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const actualFormattedEnd = actualEndDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      prompt = `Analyze these historical earthquake records from ${actualFormattedStart} to ${actualFormattedEnd}:
${JSON.stringify(earthquakes, null, 2)}`;
    } else {
      prompt = `No earthquake records found in the database.`;
    }

    let aiSummary;
    try {
      aiSummary = await generateResponse(prompt, systemInstruction);
    } catch (error: any) {
      if (error.status === 429) {
        aiSummary =
          "AI analysis is temporarily unavailable due to high demand. Please try again later.";
      } else {
        aiSummary = "AI analysis is currently unavailable.";
      }
    }

    return res.status(200).send({
      message: "Earthquake record retrieved successfully",
      statusCode: 200,
      data: earthquakes,
      aiSummary: typeof aiSummary === "string" ? aiSummary : aiSummary.text,
    });
  } catch (error) {
    return res.status(500).send({
      message:
        "An unexpected error occurred while getting all the earthquake records. Please try again later. If the problem persists, contact support.",
      error: "Internal Server Error",
      statusCode: 500,
    });
  }
}

export async function getEarthquake(req: Request, res: Response) {
  const { earthquakeId } = req.params;

  if (!earthquakeId) {
    return res.status(400).send({
      message: "Earthquake ID is required",
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
      .from(earthquake)
      .where(eq(earthquake.id, earthquakeId));

    if (!data) {
      return res.status(404).send({
        message: "Earthquake record with the specified ID could not be found",
        error: "Not Found",
        statusCode: 404,
      });
    }

    return res.status(200).send({
      message: "Earthquake record retrieved successfully",
      statusCode: 200,
      data,
    });
  } catch (error) {
    return res.status(500).send({
      message:
        "An unexpected error occurred while getting the earthquake record. Please try again later. If the problem persists, contact support.",
      error: "Internal Server Error",
      statusCode: 500,
    });
  }
}
