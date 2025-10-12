import { config } from "dotenv";
import { eq } from "drizzle-orm";
import { Expo, ExpoPushMessage, ExpoPushTicket } from "expo-server-sdk";

import { db } from "../../drizzle";
import { user } from "../../drizzle/schema";

config({ path: ".env.local" });

const expo = new Expo({
  accessToken: process.env.EXPO_ACCESS_TOKEN,
});

export async function getAllNotificationEnabledPushTokens(): Promise<
  { token: string; name: string }[] | null
> {
  const users = await db
    .select({ token: user.expoPushToken, name: user.name })
    .from(user)
    .where(eq(user.pushNotification, true));

  if (!users.length) return null;

  const validTokens = users.filter(
    (u) => u.token && Expo.isExpoPushToken(u.token)
  );

  if (!validTokens.length) return null;

  return validTokens as { token: string; name: string }[];
}

export async function sendPushNotifications(
  magnitude: number,
  message: string
): Promise<{ success: boolean; tickets?: ExpoPushTicket[]; error?: string }> {
  try {
    const tokens = await getAllNotificationEnabledPushTokens();

    if (!tokens || !tokens.length) {
      return {
        success: false,
        error: "No valid push tokens found",
      };
    }

    const messages: ExpoPushMessage[] = [];

    for (const { token } of tokens) {
      if (!Expo.isExpoPushToken(token)) {
        console.error(`Push token ${token} is not a valid Expo push token`);
        continue;
      }

      messages.push({
        to: token,
        sound: "default",
        title: `🚨 Earthquake Alert: Magnitude ${magnitude}`,
        body: message,
        data: { magnitude, type: "earthquake" },
        priority: "high",
        channelId: "earthquake-alerts",
      });
    }

    const chunks = expo.chunkPushNotifications(messages);
    const tickets: ExpoPushTicket[] = [];

    for (const chunk of chunks) {
      try {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        console.error("Error sending push notification chunk:", error);
      }
    }

    console.log("✅ Total tickets sent:", tickets.length);
    console.log("📊 Ticket details:", JSON.stringify(tickets, null, 2));

    return {
      success: true,
      tickets,
    };
  } catch (error) {
    console.error("Error in sendPushNotifications:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
