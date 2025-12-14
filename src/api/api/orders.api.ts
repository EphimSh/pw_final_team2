import { IApiClient } from "api/apiClients/types";
import { apiConfig } from "config/apiConfig";
import { IRequestOptions } from "data/types/core.types";
import { IDeliveryInfo, IOrderCreateBody, IOrderResponse, ORDER_STATUSES } from "data/types/orders.types";

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

  //("POST /api/customers/${id}/orders")
  async updateDelivery(id: string, delivery: IDeliveryInfo, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints.ordersDelivery(id),
      method: "post",
      data: delivery,
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.apiClient.send<IOrderResponse>(options);
  }

  // ("PUT /api/orders/{id}/status")
  async updateStatus(data: { id: string; status: ORDER_STATUSES }, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints.orderStatus(data.id),
      method: "put",
      data: { status: data.status },
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.apiClient.send<IOrderResponse>(options);
  }

  // ("GET /api/orders/{id}")
  async getByID(id: string, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints.orderById(id),
      method: "get",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.apiClient.send<IOrderResponse>(options);
  }

  // ("DELETE /api/orders/{id}")
  async delete(id: string, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints.orderById(id),
      method: "delete",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.apiClient.send<null>(options);
  }
}
