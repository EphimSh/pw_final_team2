import { IApiClient } from "api/apiClients/types";
import { apiConfig } from "config/apiConfig";
import { IRequestOptions } from "data/types/core.types";
import { INotificationResponse, INotificationsResponse } from "data/types/notifications.types";

export class NotificationApi {
  constructor(private apiClient: IApiClient) {}

  // GET /api/notifications
  async getList(token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints.notifications,
      method: "get",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      return await this.apiClient.send<INotificationsResponse>(options);
    } catch (error) {
      console.error(`Failed to get all notifications:`, error);
      throw error;
    }
  }

  //"Patch /api/notifications/mark-all-read"
  async markAll(token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints.notificationsAll,
      method: "patch",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      return await this.apiClient.send<INotificationsResponse>(options);
    } catch (error) {
      console.error(`Failed to get all notifications:`, error);
      throw error;
    }
  }

  //"Patch /api/notifications/id/read"
  async markById(_id: string, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints.notificationById(_id),
      method: "patch",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      return await this.apiClient.send<INotificationResponse>(options);
    } catch (error) {
      console.error(`Failed to get notification by id ${_id}:`, error);
      throw error;
    }
  }
}
