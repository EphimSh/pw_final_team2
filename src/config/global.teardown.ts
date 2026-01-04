import { NotificationService } from "utils/notifications/notifications.service";
import { TelegramService } from "utils/notifications/telegram.service";

export default async function () {
  if (!process.env.CI || process.env.TELEGRAM_NOTIFY_FROM_TEARDOWN !== "true") return;
  if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) return;

  const notificationService = new NotificationService(new TelegramService());

  await notificationService.postNotification(`Test run finished!`);
}
