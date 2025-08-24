import { and, gte, lte } from "drizzle-orm";

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
