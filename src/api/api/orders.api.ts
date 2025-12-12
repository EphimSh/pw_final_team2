import { IApiClient } from "api/apiClients/types";
import { apiConfig } from "config/apiConfig";
import { IRequestOptions } from "data/types/core.types";
import { IOrderCreateBody, IOrderResponse } from "data/types/orders.types";

export class OrdersApi {
  constructor(private apiClient: IApiClient) {}

  //("POST /api/orders")
  async create(orderData: IOrderCreateBody, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints.orders,
      method: "post",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: orderData,
    };

    try {
      return await this.apiClient.send<IOrderResponse>(options);
    } catch (error) {
      console.error(`Failed to create order for customer ${orderData.customer}:`, error);
      throw error;
    }
  }

  // ("POST /api/orders/{id}/comments")
  async addComment(_id: string, token: string, comment: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints.orderComments(_id),
      method: "post",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: JSON.stringify({ comment }),
    };

    try {
      return await this.apiClient.send<IOrderResponse>(options);
    } catch (error) {
      console.error(`Failed to add comment for order with ID: ${_id}:`, error);
      throw error;
    }
  }

  async deleteComment(token: string, orderID: string, commentID: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints.orderCommentsById(orderID, commentID),
      method: "delete",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      return await this.apiClient.send<IOrderResponse>(options);
    } catch (error) {
      console.error(`Failed to delete comment with ID: ${commentID} for order with ID: ${orderID}:`, error);
      throw error;
    }
  }
}
