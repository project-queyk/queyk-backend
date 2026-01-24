import { and, gte, lte, desc, asc } from "drizzle-orm";

import { db } from "../../drizzle";
import { Reading } from "../schema";
import { reading } from "../../drizzle/schema";

export async function getAllReadings(): Promise<Reading[] | null> {
  const readings = await db.select().from(reading);

  if (!readings.length) return null;

  return readings;
}

export async function getAllStartEndReadings(startDate: Date, endDate: Date) {
  const readings = await db
    .select()
    .from(reading)
    .where(
      and(gte(reading.createdAt, startDate), lte(reading.createdAt, endDate))
    );

  if (!readings.length) return null;

  return readings;
}

export async function getFirstDataDate() {
  const [readings] = await db
    .select({ firstDate: reading.createdAt })
    .from(reading).orderBy(asc(reading.createdAt))
    .limit(1);

  if (!readings) return null;

  return readings;
}

export async function getBatteryLevel() {
  const [readings] = await db
    .select({ battery: reading.battery, createdAt: reading.createdAt })
    .from(reading)
    .orderBy(desc(reading.createdAt))
    .limit(1);

  if (!readings) return null;

  const now = new Date();
  const lastReadingDate =
    readings.createdAt instanceof Date
      ? readings.createdAt
      : new Date(readings.createdAt);
  const diffMs = now.getTime() - lastReadingDate.getTime();
  const diffMinutes = Math.abs(diffMs) / (1000 * 60);

  if (diffMinutes > 6) {
    return null;
  }

  return readings;
}
