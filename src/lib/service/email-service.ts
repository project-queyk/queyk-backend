import { config } from "dotenv";
import { eq } from "drizzle-orm";
import nodemailer from "nodemailer";

import { db } from "../../drizzle";
import { user } from "../../drizzle/schema";

config({ path: ".env.local" });

export const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  auth: {
    user: process.env.APP_GMAIL_EMAIL,
    pass: process.env.APP_GMAIL_PASSWORD,
  },
  secure: true,
  port: 465,
});

export async function getAllNotificationEnabledEmails(): Promise<
  { email: string; name: string }[] | null
> {
  const emails = await db
    .select({ email: user.email, name: user.name })
    .from(user)
    .where(eq(user.alertNotification, true));

  if (!emails.length) return null;

  return emails;
}

export const emergencyContacts = [
  {
    name: "School Clinic",
    number: "09755721421"
  },
  {
    name: "School Security", 
    number: "09569114566"
  },
  {
    name: "Facilities Management",
    number: "09460548474"
  }
];
