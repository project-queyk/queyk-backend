import { eq } from "drizzle-orm";
import { Request, Response } from "express";

import { db } from "../drizzle";
import { getIO } from "../lib/socket";
import { verifyToken } from "../lib/auth";
import { reading } from "../drizzle/schema";
import { createReadingSchema } from "../lib/schema";
import generateResponse from "../lib/service/claude";
import {
  formatZodError,
  getSeismicRiskLevelForReading,
  isReadingSeismicSafe,
} from "../lib/utils";
import {
  getAllReadings,
  getAllStartEndReadings,
  getBatteryLevel,
  getFirstDataDate,
} from "../lib/service/reading-service";

function getBucketMs(rangeDays: number): number {
  if (rangeDays <= 1) return 30 * 60 * 1000;
  if (rangeDays <= 3) return 60 * 60 * 1000;
  if (rangeDays <= 7) return 2 * 60 * 60 * 1000;
  if (rangeDays <= 30) return 6 * 60 * 60 * 1000;
  return 24 * 60 * 60 * 1000;
}

function downsampleReadings<
  T extends {
    createdAt: string;
    siAverage: number;
    siMinimum: number;
    siMaximum: number;
    battery: number;
    signalStrength: string;
  },
>(readings: T[], start: Date, end: Date): T[] {
  const rangeDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
  const bucketMs = getBucketMs(rangeDays);
  const buckets = new Map<number, T[]>();

  for (const r of readings) {
    const t = new Date(r.createdAt).getTime();
    const bucketKey = Math.floor(t / bucketMs) * bucketMs;
    const list = buckets.get(bucketKey);
    if (list) list.push(r);
    else buckets.set(bucketKey, [r]);
  }

  return Array.from(buckets.entries())
    .sort(([a], [b]) => a - b)
    .map(([, group]) => {
      const base = group[0];
      return {
        ...base,
        createdAt: new Date(base.createdAt).toISOString(),
        siAverage:
          group.reduce((sum, r) => sum + r.siAverage, 0) / group.length,
        siMinimum: Math.min(...group.map((r) => r.siMinimum)),
        siMaximum: Math.max(...group.map((r) => r.siMaximum)),
        battery: group[group.length - 1].battery,
        signalStrength: group[group.length - 1].signalStrength,
      };
    });
}

const systemInstruction = `You are a seismic analyst AI for the Queyk Earthquake Early Warning System. Your task is to analyze historical seismic readings and provide a clear, concise, and professional summary of the seismic activity over the given date range.
Analyze the provided seismic data (which includes dates, SI values, peak ground acceleration, and sensor status) and generate a short summary that includes:
- An overview of seismic activity (e.g., whether readings were within normal background levels or showed significant peaks).
- Peak activity identified (highest SI value, when it occurred, and its risk level).
- Trends or patterns observed during the period.
- General safety assessment based on the data.
Keep the tone informative, objective, and reassuring. Avoid unnecessary alarmism. The summary should be suitable for displaying on a dashboard for school safety administrators. Keep it concise (around 3-5 sentences).`;

export async function createReading(req: Request, res: Response) {
  const { siAverage, siMinimum, siMaximum, battery, signalStrength } = req.body;

  const missingFields = [];
  if (siAverage === undefined) missingFields.push("siAverage");
  if (siMinimum === undefined) missingFields.push("siMinimum");
  if (siMaximum === undefined) missingFields.push("siMaximum");
  if (battery === undefined) missingFields.push("battery");
  if (signalStrength === undefined) missingFields.push("signalStrength");

  if (missingFields.length > 0) {
    return res.status(400).send({
      message: `Missing required fields: ${missingFields.join(", ")}`,
      error: "Bad Request",
      statusCode: 400,
    });
  }

  const readingValues = {
    siAverage: Number(siAverage),
    siMinimum: Number(siMinimum),
    siMaximum: Number(siMaximum),
    battery: Number(battery),
    signalStrength: String(signalStrength),
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
        message: "Error creating reading",
        error: "Internal server error",
        statusCode: 500,
      });
    }

    try {
      const io = getIO();
      io.emit("reading", newReading);
    } catch {}

    return res.status(201).send({
      message: "Reading created successfully",
      statusCode: 201,
      data: newReading,
    });
  } catch (error) {
    return res.status(500).send({
      message:
        error instanceof Error ? error.message : "Error creating reading",
      error: "Internal server error",
      statusCode: 500,
    });
  }
}

export async function getReadings(req: Request, res: Response) {
  const { startDate, endDate, platform } = req.query;

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
      const readingsMapped = Array.isArray(readingsRaw)
        ? readingsRaw.map((r) => ({
            ...r,
            createdAt:
              r.createdAt instanceof Date
                ? r.createdAt.toISOString()
                : new Date(r.createdAt).toISOString(),
            riskLevel: getSeismicRiskLevelForReading(r),
            isSafe: isReadingSeismicSafe(r),
          }))
        : [];

      const readings =
        platform === "web"
          ? readingsMapped
          : downsampleReadings(readingsMapped, start, end);

      let actualFormattedStart = start.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      let actualFormattedEnd = end.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      let prompt;
      if (readings.length > 0) {
        const dates = readings.map((r) => new Date(r.createdAt));
        const actualStartDate = new Date(
          Math.min(...dates.map((d) => d.getTime())),
        );
        const actualEndDate = new Date(
          Math.max(...dates.map((d) => d.getTime())),
        );

        actualFormattedStart = actualStartDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          timeZone: "Asia/Manila",
        });
        actualFormattedEnd = actualEndDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          timeZone: "Asia/Manila",
        });

        const sampleSize = Math.min(20, Math.ceil(readings.length / 10));
        const step = Math.ceil(readings.length / sampleSize);
        const sampledReadings = readings.filter((_, i) => i % step === 0);

        const stats = {
          totalReadings: readings.length,
          avgSI: (
            readings.reduce((sum, r) => sum + r.siAverage, 0) / readings.length
          ).toFixed(3),
          maxSI: Math.max(...readings.map((r) => r.siMaximum)).toFixed(3),
          minSI: Math.min(...readings.map((r) => r.siMinimum)).toFixed(3),
          sampleCount: sampledReadings.length,
        };

        prompt = `Analyze seismic readings from ${actualFormattedStart} to ${actualFormattedEnd}:\nStats - Total readings: ${stats.totalReadings}, Avg SI: ${stats.avgSI}, Max SI: ${stats.maxSI}, Min SI: ${stats.minSI}\nSample readings (${stats.sampleCount} of ${stats.totalReadings}):\n${JSON.stringify(sampledReadings)}\nBattery level: ${batteryLevel?.battery || "Unknown"}%`;
      } else {
        prompt = `No seismic readings found for the requested period.\nBattery level: ${batteryLevel?.battery || "Unknown"}%`;
      }

      let aiSummary;
      if (readings.length) {
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
      } else {
        aiSummary =
          "No AI summary available because there are no seismic readings for the selected period.";
      }

      let peakMagnitude = { value: 0, time: "-" };
      let avgMagnitude = "-";
      let significantReadings = 0;
      let peakActivity: { value: string; siAverage?: number } = { value: "-" };
      if (readings && readings.length > 0) {
        const peak = readings.reduce(
          (max, r) => (r.siMaximum > max.siMaximum ? r : max),
          readings[0],
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
          readings[0],
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

      let pdfBase64: string | null = null;
      try {
        const { generateSeismicReportBuffer } =
          await import("../lib/pdf-generator");
        const pdfBuffer = await generateSeismicReportBuffer({
          readings,
          dateRange: `${actualFormattedStart} - ${actualFormattedEnd}`,
          peakMagnitude,
          avgMagnitude,
          significantReadings,
          peakActivity,
          batteryLevel: batteryLevel?.battery || 0,
          aiSummary,
        });
        pdfBase64 = pdfBuffer.toString("base64");
      } catch (pdfError) {
        console.error("Failed to generate PDF report buffer:", pdfError);
      }

      return res.status(200).send({
        message: "Readings retrieved successfully",
        statusCode: 200,
        data: readings,
        firstDate: firstDate?.firstDate,
        batteryLevel: batteryLevel?.battery,
        aiSummary,
        pdfBase64,
      });
    }

    const readings = await getAllReadings();

    const readingsWithRisk = Array.isArray(readings)
      ? readings.map((r) => ({
          ...r,
          riskLevel: getSeismicRiskLevelForReading(r),
          isSafe: isReadingSeismicSafe(r),
        }))
      : [];

    return res.status(200).send({
      message: "Readings retrieved successfully",
      statusCode: 200,
      data: readingsWithRisk,
    });
  } catch (error) {
    console.error("Error in getReadings:", error);
    return res.status(500).send({
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while getting all the readings.",
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
        message: "Reading not found",
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
      message: error instanceof Error ? error.message : "Error getting reading",
      error: "Internal server error",
      statusCode: 500,
    });
  }
}
