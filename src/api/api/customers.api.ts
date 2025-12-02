import { IApiClient } from "api/apiClients/types";
import { apiConfig } from "config/apiConfig";
import { IRequestOptions } from "data/types/core.types";
import {
  ICustomer,
  ICustomerResponse,
  ICustomersSortedResponse,
  IGetCustomersParams,
} from "data/types/customers.types";
import { convertRequestParams } from "utils/queryParams.utils";

export class CustomersApi {
  constructor(private apiClient: IApiClient) {}

  //post
  //put
  //get by id
  //get all
  //get with pagination
  //delete

  //("DELETE /api/customers/:id")
  async delete(_id: string, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints.customerById(_id),
      method: "delete",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.apiClient.send<null>(options);
  }

  //("POST /api/customers")
  async create(customer: ICustomer, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints.customers,
      method: "post",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: customer,
    };
    return await this.apiClient.send<ICustomerResponse>(options);
  }

  //("PUT /api/customers/:id")
  async update(_id: string, newCustomer: ICustomer, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints.customerById(_id),
      method: "put",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: newCustomer,
    };
    return await this.apiClient.send<ICustomerResponse>(options);
  }

  //("GET /api/customers/:id")
  async getById(_id: string, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints.customerById(_id),
      method: "get",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.apiClient.send<ICustomerResponse>(options);
  }

  //("GET /api/customers/all")
  async getAll(token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints.customersAll,
      method: "get",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.apiClient.send<ICustomerResponse>(options);
  }

  //("GET /api/products with sorting")
  async getSorted(token: string, params?: Partial<IGetCustomersParams>) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints.customers + (params ? convertRequestParams(params) : ""),
      method: "get",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.apiClient.send<ICustomersSortedResponse>(options);
  }
}
