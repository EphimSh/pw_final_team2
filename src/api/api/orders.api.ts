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
}
