import { NotificationApi } from "api/api/notifications.api";
import { patchAllNotificationsSchema } from "data/schemas/notifications/getAll.schema";
import { getNotificationSchema } from "data/schemas/notifications/getById.schema";
import { STATUS_CODES } from "data/statusCode";
import { validateResponse } from "utils/validation/validateResponse.utils";

export class NotificationsApiService {
  constructor(private notificationsApi: NotificationApi) {}

  async getList(token: string) {
    const response = await this.notificationsApi.getList(token);
    validateResponse(response, {
      status: STATUS_CODES.OK,
      IsSuccess: true,
      ErrorMessage: null,
      schema: patchAllNotificationsSchema,
    });
    return response.body.Notifications;
  }

  async markById(id: string, token: string) {
    const response = await this.notificationsApi.markById(id, token);
    validateResponse(response, {
      status: STATUS_CODES.OK,
      IsSuccess: true,
      ErrorMessage: null,
      schema: getNotificationSchema,
    });
    return response.body;
  }

  async markAll(token: string) {
    const response = await this.notificationsApi.markAll(token);
    validateResponse(response, {
      status: STATUS_CODES.OK,
      IsSuccess: true,
      ErrorMessage: null,
      schema: patchAllNotificationsSchema,
    });
    return response.body.Notifications;
  }
}
