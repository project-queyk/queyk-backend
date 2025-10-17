import { eq } from "drizzle-orm";
import { Request, Response } from "express";

import { db } from "../drizzle";
import { reading } from "../drizzle/schema";
import { verifyToken } from "../lib/auth";
import { formatZodError } from "../lib/utils";
import { createReadingSchema } from "../lib/schema";
import generateResponse from "../lib/service/gemini";
import {
  getAllReadings,
  getAllStartEndReadings,
  getBatteryLevel,
  getFirstDataDate,
} from "../lib/service/reading-service";

const systemInstruction = `You are a seismic monitoring AI assistant for earthquake detection and analysis. Generate a concise professional summary that includes:
- Current seismic activity level assessment
- Risk evaluation based on SI values (normal: <0.5, elevated: 0.5-1.0, concerning: >1.0)
- Notable patterns or anomalies in the data
- Brief safety recommendations if applicable
Keep response under 150 words and maintain a calm, informative tone.
IMPORTANT: Convert all UTC times to Philippine Time (UTC+8) when displaying dates and times in your response. Display times in 12-hour format (e.g., "04:00 AM" or "04:00 PM") without mentioning "Philippine Time" or timezone. Be careful with AM/PM conversion - double-check that morning hours show AM and afternoon/evening hours show PM.
Write naturally as if you are directly reporting on seismic monitoring without referencing datasets or data sources. Present findings as direct observations from monitoring equipment.`;

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

      start.setHours(-8, 0, 0, 0);
      end.setHours(15, 59, 59, 999);

      const firstDate = await getFirstDataDate();
      const batteryLevel = await getBatteryLevel();
      const readingsRaw = await getAllStartEndReadings(start, end);
      const readings = Array.isArray(readingsRaw)
        ? readingsRaw.map((r) => ({
            ...r,
            createdAt: r.createdAt.toISOString(),
          }))
        : [];

      let actualFormattedStart = start.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "Asia/Manila",
      });
      let actualFormattedEnd = end.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "Asia/Manila",
      });

      let prompt;
      if (readings.length > 0) {
        const dates = readings.map((r) => new Date(r.createdAt));
        const actualStartDate = new Date(
          Math.min(...dates.map((d) => d.getTime()))
        );
        const actualEndDate = new Date(
          Math.max(...dates.map((d) => d.getTime()))
        );

        actualFormattedStart = actualStartDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        actualFormattedEnd = actualEndDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        prompt = `Analyze these seismic readings from ${actualFormattedStart} to ${actualFormattedEnd}:
${JSON.stringify(readings, null, 2)}
Battery level: ${batteryLevel?.battery || "Unknown"}%`;
      } else {
        prompt = `No seismic readings found for the requested period.
Battery level: ${batteryLevel?.battery || "Unknown"}%`;
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

      let peakMagnitude = { value: 0, time: "-" };
      let avgMagnitude = "-";
      let significantReadings = 0;
      let peakActivity: { value: string; siAverage?: number } = { value: "-" };
      if (readings && readings.length > 0) {
        const peak = readings.reduce(
          (max, r) => (r.siMaximum > max.siMaximum ? r : max),
          readings[0]
        );
        peakMagnitude = {
          value: peak.siMaximum,
          time: new Date(peak.createdAt).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        const avg =
          readings.reduce((sum, r) => sum + r.siAverage, 0) / readings.length;
        avgMagnitude = avg.toFixed(3);
        significantReadings = readings.filter((r) => r.siAverage > 0.5).length;
        const peakAct = readings.reduce(
          (max, r) => (r.siAverage > max.siAverage ? r : max),
          readings[0]
        );
        peakActivity = {
          value: new Date(peakAct.createdAt).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          siAverage: peakAct.siAverage,
        };
      }

      const { generateSeismicReportBuffer } = await import(
        "../lib/pdf-generator"
      );
      const pdfBuffer = await generateSeismicReportBuffer({
        readings,
        dateRange: `${actualFormattedStart} - ${actualFormattedEnd}`,
        peakMagnitude,
        avgMagnitude,
        significantReadings,
        peakActivity,
        batteryLevel: batteryLevel?.battery || 0,
        aiSummary:
          typeof aiSummary === "string" ? aiSummary : aiSummary?.text || "",
      });
      const pdfBase64 = pdfBuffer.toString("base64");

      return res.status(200).send({
        message: "Readings retrieved successfully",
        statusCode: 200,
        data: readings,
        firstDate: firstDate?.firstDate,
        batteryLevel: batteryLevel?.battery,
        aiSummary:
          typeof aiSummary === "string" ? aiSummary : aiSummary?.text || "",
        pdfBase64,
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
