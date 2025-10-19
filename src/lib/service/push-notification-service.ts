import { config } from "dotenv";
import { eq } from "drizzle-orm";
import { Expo, ExpoPushMessage, ExpoPushTicket } from "expo-server-sdk";
import webpush, { PushSubscription } from "web-push";

import { db } from "../../drizzle";
import { user } from "../../drizzle/schema";

config({ path: ".env.local" });

const expo = new Expo({
  accessToken: process.env.EXPO_ACCESS_TOKEN,
});

webpush.setVapidDetails(
  "mailto:" + process.env.APP_GMAIL_EMAIL,
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

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

export async function getAllNotificationEnabledWebPushSubscriptions(): Promise<
  { subscription: PushSubscription; name: string }[] | null
> {
  const users = await db
    .select({ subscription: user.webPushSubscription, name: user.name })
    .from(user)
    .where(eq(user.pushNotification, true));

  if (!users.length) return null;

  const validSubscriptions = users.filter(
    (u) => u.subscription && (u.subscription as PushSubscription).endpoint
  );

  if (!validSubscriptions.length) return null;

  return validSubscriptions as {
    subscription: PushSubscription;
    name: string;
  }[];
}

export async function sendPushNotifications(
  magnitude: number,
  message: string
): Promise<{ success: boolean; tickets?: ExpoPushTicket[]; error?: string }> {
  try {
    const tokens = await getAllNotificationEnabledPushTokens();

    if (tokens && tokens.length) {
      const messages: ExpoPushMessage[] = [];

      for (const { token } of tokens) {
        if (!Expo.isExpoPushToken(token)) {
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
    }

    const subscriptions = await getAllNotificationEnabledWebPushSubscriptions();

    if (subscriptions && subscriptions.length) {
      const notificationPayload = JSON.stringify({
        title: `🚨 Earthquake Alert: Magnitude ${magnitude}`,
        body: message,
        icon: "/icon.png",
        data: { magnitude, type: "earthquake" },
      });

      for (const { subscription } of subscriptions) {
        try {
          await webpush.sendNotification(subscription, notificationPayload);
        } catch (error) {
          console.error("Error sending web push notification:", error);
        }
      }
    }

    return {
      success: true,
      tickets: tokens ? [] : undefined,
    };
  } catch (error) {
    console.error("Error in sendPushNotifications:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
