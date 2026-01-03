import { IApiClient } from "api/apiClients/types";
import { apiConfig } from "config/apiConfig";
import { IRequestOptions } from "data/types/core.types";
import {
  IDeliveryInfo,
  IOrderCreateBody,
  IOrderResponse,
  IOrdersResponse,
  ORDER_STATUSES,
} from "data/types/orders.types";

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
  async updateDeliveryDetails(id: string, deliveryDetails: IDeliveryInfo, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints.ordersDelivery(id),
      method: "post",
      data: deliveryDetails,
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      return await this.apiClient.send<IOrderResponse>(options);
    } catch (error) {
      console.error(`Failed to update Delivery Details for order with ID: ${id}:`, error);
      throw error;
    }
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

    try {
      return await this.apiClient.send<IOrderResponse>(options);
    } catch (error) {
      console.error(`Failed to update status for order with ID: ${data.id}:`, error);
      throw error;
    }
  }

  // ("PUT /api/orders/{id}")
  async update(id: string, orderData: IOrderCreateBody, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints.orderById(id),
      method: "put",
      data: orderData,
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      return await this.apiClient.send<IOrderResponse>(options);
    } catch (error) {
      console.error(`Failed to update for order with ID: ${id}:`, error);
      throw error;
    }
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

    try {
      return await this.apiClient.send<IOrderResponse>(options);
    } catch (error) {
      console.error(`Failed to get order with ID: ${id}:`, error);
      throw error;
    }
  }

  // ("DELETE /api/orders/{id}")
  async delete(id: string, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints.orderById(id),
      method: "delete",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      return await this.apiClient.send<null>(options);
    } catch (error) {
      console.error(`Failed delete order with ID: ${id}:`, error);
      throw error;
    }
  }

  // ("POST /api/orders/{id}/comments")
  async addComment(id: string, comment: string, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints.orderComments(id),
      method: "post",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: JSON.stringify({ comment: comment }),
    };

    try {
      return await this.apiClient.send<IOrderResponse>(options);
    } catch (error) {
      console.error(`Failed to add comment for order with ID: ${id}:`, error);
      throw error;
    }
  }

  // DELETE /api/orders/{orderId}/comments/{commentId}
  async deleteComment(orderID: string, commentID: string, token: string) {
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

  async markProductsAsReceived(orderID: string, productIDs: string[], token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints.ordersReceived(orderID),
      method: "post",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: { products: productIDs },
    };

    try {
      return await this.apiClient.send<IOrderResponse>(options);
    } catch (error) {
      console.error(`Failed to mark products as received in order with ID: ${orderID} `, error);
      throw error;
    }
  }

  async getOrdersByCustomer(customerId: string, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints.ordersByCustomer(customerId),
      method: "get",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      return await this.apiClient.send<IOrdersResponse>(options);
    } catch (error) {
      console.error(`Failed to retrieve orders for the customer ID : ${customerId} `, error);
      throw error;
    }
  }
}
