import { and, gte, lte } from "drizzle-orm";

import { db } from "../../drizzle";
import { Earthquake } from "../schema";
import { earthquake, reading } from "../../drizzle/schema";

export async function getAllEarthquakes(): Promise<Earthquake[] | null> {
  const earthquakes = await db.select().from(earthquake);

  if (!earthquakes.length) return null;

  return earthquakes;
}

export async function getAllStartEndEarthquakes(
  startDate: Date,
  endDate: Date
) {
  const earthquakes = await db
    .select()
    .from(earthquake)
    .where(
      and(
        gte(earthquake.createdAt, startDate),
        lte(earthquake.createdAt, endDate)
      )
    );

  if (!earthquakes.length) return null;

  return earthquakes;
}
