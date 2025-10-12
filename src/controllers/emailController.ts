import { config } from "dotenv";
import { Request, Response } from "express";

import { verifyToken } from "../lib/auth";
import {
  getAllNotificationEnabledEmails,
  transporter,
} from "../lib/service/email-service";
import { sendPushNotifications } from "../lib/service/push-notification-service";

config({ path: ".env.local" });

export async function sendEmail(req: Request, res: Response) {
  const { magnitude } = req.body;

  if (!magnitude) {
    return res.status(400).send({
      message: "Earthquake magnitude is required for the alert email",
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

    const emails = await getAllNotificationEnabledEmails();

    if (!emails || !emails.length) {
      return res.status(404).send({
        message: "No notification-enabled email recipients found",
        error: "NotFound",
        statusCode: 404,
      });
    }

    const notificationMessage =
      magnitude < 3
        ? `Estimated magnitude ${magnitude} earthquake detected. Seek shelter immediately. Drop, cover, and hold.`
        : magnitude < 6
        ? `Estimated magnitude ${magnitude} earthquake detected. Drop, cover, and hold on. Stay away from windows and exterior walls.`
        : `Estimated magnitude ${magnitude} earthquake detected. Drop, cover, and hold on. Evacuate to designated safe zones after shaking stops.`;

    await transporter.sendMail({
      from: `"Queyk" <${process.env.APP_GMAIL_EMAIL}>`,
      to: emails.map((user) => user.email),
      subject: `Earthquake Alert: Magnitude ${magnitude} Detected`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #212529; background-color: #f1f3f5; margin: 0; padding: 20px;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; border: 1px solid #e9ecef; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <!-- Header -->
           <tr>
              <td style="background: linear-gradient(135deg, #193867 0%, #35507a 100%); background-color: #193867; padding: 30px 20px; border-radius: 12px 12px 0 0;">
                <!-- Logo placeholder - Replace with permanent hosted image URL -->
                <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 15px;">
                  <tr>
                    <td align="left" valign="middle">
                      <img src="https://www.queyk.com/queyk-logo-white.png" alt="QUEYK" style="width: 100px; height: 30px; display: block;" />
                    </td>
                    <td align="right" valign="middle">
                      <img src="https://elc-public-images.s3.ap-southeast-1.amazonaws.com/icc-logo.png" alt="ICC" style="width: 30px; height: 30px; display: block;" />
                    </td>
                  </tr>
                </table>
                <h1 style="margin: 0; font-size: 28px; font-weight: bold; color: #ffd43b; text-align: center; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);">🚨 Earthquake Alert</h1>
              </td>
            </tr>
            
            <!-- Content -->
            <tr>
              <td style="padding: 30px;">
                <p style="margin: 0 0 16px 0; color: #212529; font-size: 16px;">Dear Immaculadians,</p>
                <p style="margin: 0 0 16px 0; color: #212529; font-size: 16px;">Our seismic monitoring system has detected earthquake activity that may affect our campus. This automated alert is being sent to ensure the safety of all students, faculty, and staff.</p>
                
                <!-- Alert Section -->
                <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-radius: 12px; margin: 20px 0; border: 1px solid #e9ecef">
                  <tr>
                    <td style="padding: 20px;">
                      <p style="margin: 0; color: ${
                        magnitude < 3
                          ? "#28a745"
                          : magnitude < 5
                          ? "#ffc107"
                          : magnitude < 7
                          ? "#fd7e14"
                          : "#dc3545"
                      }; font-size: 18px; font-weight: bold">${notificationMessage}</p>
                    </td>
                  </tr>
                </table>
                
                <p style="margin: 0 0 16px 0; color: #212529; font-size: 16px;"><strong style="color: #193867; font-weight: bold;">Immediate Action Required:</strong></p>
                <p style="margin: 0 0 8px 0; color: #212529; font-size: 16px;">• Follow the school's earthquake safety protocols</p>
                <p style="margin: 0 0 8px 0; color: #212529; font-size: 16px;">• Proceed to designated evacuation areas if instructed</p>
                <p style="margin: 0 0 8px 0; color: #212529; font-size: 16px;">• Listen for announcements from school personnel</p>
                <p style="margin: 0 0 8px 0; color: #212529; font-size: 16px;">• Stay calm and assist others as needed</p>
                <p style="margin: 0 0 16px 0; color: #212529; font-size: 16px;">• Wait for all-clear signals before resuming normal activities</p>
                
                <p style="margin: 0 0 16px 0; color: #212529; font-size: 16px;"><strong style="color: #193867; font-weight: bold;">Emergency Contacts:</strong></p>
                <p style="margin: 0 0 8px 0; color: #212529; font-size: 16px;">• School Clinic: 09755721421</p>
                <p style="margin: 0 0 8px 0; color: #212529; font-size: 16px;">• School Security: 09569114566</p>
                <p style="margin: 0 0 16px 0; color: #212529; font-size: 16px;">• Facilities Management: 09460548474</p>
              </td>
            </tr>
            
            <!-- Footer -->
            <tr>
              <td style="background-color: #f1f3f5; text-align: center; padding: 20px; font-size: 12px; color: #556575; border-top: 1px solid #e9ecef; border-radius: 0 0 12px 12px;">
                <p style="margin: 0;">&copy; ${new Date().getFullYear()} Queyk. All rights reserved.</p>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    let pushResult = { success: false, ticketCount: 0 };
    try {
      const result = await sendPushNotifications(
        magnitude,
        notificationMessage
      );
      pushResult = {
        success: result.success,
        ticketCount: result.tickets?.length || 0,
      };
    } catch (pushError) {
      console.error("Failed to send push notifications:", pushError);
    }

    res.status(200).json({
      message: "Notifications sent successfully",
      statusCode: 200,
      data: {
        email: { success: true },
        pushNotification: pushResult,
      },
    });
  } catch (error) {
    return res.status(500).send({
      message:
        error instanceof Error
          ? error.message
          : "There was an error sending the email.",
      error: "Internal Server Error",
      statusCode: 500,
    });
  }
}
