import { desc } from 'drizzle-orm';
import { db } from '../../drizzle';
import { reading, user } from '../../drizzle/schema';
import { sendAdminPushNotifications } from './push-notification-service';

let deviceOfflineNotificationSent = false;
const DEVICE_OFFLINE_THRESHOLD_MINUTES = 6;

export async function getLastReadingTime() {
  const [lastReading] = await db
    .select({ createdAt: reading.createdAt })
    .from(reading)
    .orderBy(desc(reading.createdAt))
    .limit(1);

  if (!lastReading) return null;

  return lastReading.createdAt;
}

export async function isDeviceOffline(): Promise<boolean> {
  const lastReadingTime = await getLastReadingTime();

  if (!lastReadingTime) return true;

  const now = new Date();
  const timeDiffMinutes = (now.getTime() - lastReadingTime.getTime()) / 60000;

  return timeDiffMinutes >= DEVICE_OFFLINE_THRESHOLD_MINUTES;
}

export async function checkDeviceStatus() {
  try {
    const offline = await isDeviceOffline();

    if (offline) {
      if (!deviceOfflineNotificationSent) {
        const lastReadingTime = await getLastReadingTime();
        const formattedTime = lastReadingTime
          ? new Date(lastReadingTime).toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })
          : 'Unknown';

        await sendAdminPushNotifications(
          `IoT Device Offline`,
          `The seismic monitoring device has not sent data for over 6 minutes. Last reading: ${formattedTime}. Please check the device status immediately.`
        );

        deviceOfflineNotificationSent = true;
      }
    } else {
      if (deviceOfflineNotificationSent) {
        deviceOfflineNotificationSent = false;
      }
    }
  } catch {
  }
}

export function startDeviceMonitoring() {
  const monitoringInterval = setInterval(checkDeviceStatus, 60000);

  checkDeviceStatus();

  return monitoringInterval;
}

export function stopDeviceMonitoring(interval: NodeJS.Timeout) {
  clearInterval(interval);
}
