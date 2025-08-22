import { ZodError } from "zod";

export function formatZodError(error: ZodError): string {
  return error.issues
    .map((err) => {
      const field = err.path.join(".");
      return `${field}: ${err.message}`;
    })
    .join(", ");
}
