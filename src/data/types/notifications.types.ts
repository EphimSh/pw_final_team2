import { ID, IResponseFields } from "./core.types";

export interface INotification {
  userId: number;
  type: string;
  orderId: number;
  message: string;
  read: boolean;
}

export interface IDateOfNotification {
  createdAt: string;
  expiresAt: string;
}

export interface INotificationFromResponse extends Required<INotification>, IDateOfNotification, ID {}

export interface INotificationsResponse extends IResponseFields {
  Notifications: INotificationFromResponse[];
}

export interface INotificationResponse extends IResponseFields {
  Notification: INotificationFromResponse;
}
