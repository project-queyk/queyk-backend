import { ZodError } from "zod";
import { Reading } from "./schema";

export function formatZodError(error: ZodError): string {
  return error.issues
    .map((err) => {
      const field = err.path.join(".");
      return `${field}: ${err.message}`;
    })
    .join(", ");
}

export type SeismicRiskLevel = 'normal' | 'elevated' | 'concerning';

export function getSeismicRiskLevel(si: number): SeismicRiskLevel {
  if (si < 0.5) return 'normal';
  if (si <= 1.0) return 'elevated';
  return 'concerning';
}

export function isSeismicSafe(si: number): boolean {
  return si < 1.0;
}

export function getSeismicRiskLevelForReading(reading: Reading): SeismicRiskLevel {
  return getSeismicRiskLevel(reading.siMaximum);
}

export function isReadingSeismicSafe(reading: Reading): boolean {
  return isSeismicSafe(reading.siMaximum);
}
