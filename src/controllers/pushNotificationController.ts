import { config } from "dotenv";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";

import { verifyToken } from "../lib/auth";
import { db } from "../drizzle";
import { user } from "../drizzle/schema";
import generateResponse from "../lib/service/gemini";
import { sendPushNotifications } from "../lib/service/push-notification-service";

config({ path: ".env.local" });

const systemInstruction =
  "You are an emergency alert system for a school. Generate concise, clear, and urgent notification text similar to mobile earthquake alerts. Always start with 'Estimated magnitude [X] earthquake detected.' Do not include 'EARTHQUAKE ALERT' prefix. Keep the tone professional but urgent, and focus only on essential safety information. Response should be 1-2 sentences maximum, like a real emergency push notification.";

export async function sendPushNotification(req: Request, res: Response) {
  const { magnitude } = req.body;

  if (!magnitude) {
    return res.status(400).send({
      message: "Earthquake magnitude is required for the alert notification",
      error: "BadRequest",
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

    const contents = `An earthquake with magnitude ${magnitude} has been detected near Immaculada Conception College. Generate an appropriate emergency notification message for the school community.`;

    let aiResponse;
    try {
      aiResponse = await generateResponse(contents, systemInstruction);
    } catch (error) {
      aiResponse = { text: null };
    }

    const notificationMessage =
      aiResponse.text ||
      (magnitude < 3
        ? `Estimated magnitude ${magnitude} earthquake detected. Seek shelter immediately. Drop, cover, and hold.`
        : magnitude < 6
        ? `Estimated magnitude ${magnitude} earthquake detected. Drop, cover, and hold on. Stay away from windows and exterior walls.`
        : `Estimated magnitude ${magnitude} earthquake detected. Drop, cover, and hold on. Evacuate to designated safe zones after shaking stops.`);

    const result = await sendPushNotifications(magnitude, notificationMessage);

    if (!result.success) {
      return res.status(404).send({
        message:
          result.error ||
          "No notification-enabled users with valid push tokens found",
        error: "NotFound",
        statusCode: 404,
      });
    }

    res.status(200).json({
      message: "Push notifications sent successfully",
      statusCode: 200,
      data: {
        ticketCount: result.tickets?.length || 0,
      },
    });
  } catch (error) {
    return res.status(500).send({
      message:
        error instanceof Error
          ? error.message
          : "There was an error sending the push notification.",
      error: "Internal Server Error",
      statusCode: 500,
    });
  }
}

export async function subscribeWebPush(req: Request, res: Response) {
  const { subscription, userId } = req.body;

  if (!subscription || !userId) {
    return res.status(400).send({
      message: "Subscription and userId are required",
      error: "BadRequest",
      statusCode: 400,
    });
  }

  try {
    await db
      .update(user)
      .set({ webPushSubscription: subscription })
      .where(eq(user.id, userId));

    res.status(200).json({
      message: "Web push subscription saved successfully",
      statusCode: 200,
    });
  } catch (error) {
    return res.status(500).send({
      message:
        error instanceof Error
          ? error.message
          : "There was an error saving the subscription.",
      error: "Internal Server Error",
      statusCode: 500,
    });
  }
}

export async function unsubscribeWebPush(req: Request, res: Response) {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).send({
      message: "userId is required",
      error: "BadRequest",
      statusCode: 400,
    });
  }

  try {
    await db
      .update(user)
      .set({ webPushSubscription: null })
      .where(eq(user.id, userId));

    res.status(200).json({
      message: "Web push subscription removed successfully",
      statusCode: 200,
    });
  } catch (error) {
    return res.status(500).send({
      message:
        error instanceof Error
          ? error.message
          : "There was an error removing the subscription.",
      error: "Internal Server Error",
      statusCode: 500,
    });
  }
}
