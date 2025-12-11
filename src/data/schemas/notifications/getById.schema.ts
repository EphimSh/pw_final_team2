import { obligatoryFieldsSchema, obligatoryRequredFields } from "../core.schema";
import { notificationSchema } from "./notification.schema";

export const getNotificationSchema = {
  type: "object",
  properties: {
    Notification: notificationSchema,
    ...obligatoryFieldsSchema,
  },
  required: ["Notification", ...obligatoryRequredFields],
};
