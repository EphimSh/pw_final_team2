import { IApiClient } from "api/apiClients/types";
import { apiConfig } from "config/apiConfig";
import { IRequestOptions } from "data/types/core.types";
import {
  ICustomer,
  ICustomerResponse,
  ICustomersResponse,
  ICustomersSortedResponse,
  IGetCustomersParams,
} from "data/types/customers.types";
import { convertRequestParams } from "utils/queryParams.utils";

export class CustomersApi {
  constructor(private apiClient: IApiClient) {}

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

    try {
      return await this.apiClient.send<ICustomerResponse>(options);
    } catch (error) {
      console.error(`Failed to delete customer with id ${_id}`, error);
      throw error;
    }
  }

  //("POST /api/customers")
  async create(customer: Partial<ICustomer>, token: string) {
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

    try {
      return await this.apiClient.send<ICustomerResponse>(options);
    } catch (error) {
      console.error(`Failed to create customer`, error);
      throw error;
    }
  }

  //("PUT /api/customers/:id")
  async update(_id: string, newCustomer: Partial<ICustomer>, token: string) {
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

    console.log(newCustomer);

    try {
      return await this.apiClient.send<ICustomerResponse>(options);
    } catch (error) {
      console.error(`Failed to update customer with id ${_id}`, error);
      throw error;
    }
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
    try {
      return await this.apiClient.send<ICustomerResponse>(options);
    } catch (error) {
      console.error(`Failed to get customer with id ${_id}`, error);
      throw error;
    }
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
    try {
      return await this.apiClient.send<ICustomersResponse>(options);
    } catch (error) {
      console.error(`Failed to get all customers`, error);
      throw error;
    }
  }

  //("GET /api/customers with sorting")
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
    try {
      return await this.apiClient.send<ICustomersSortedResponse>(options);
    } catch (error) {
      console.error(`Failed to get customers with sorting`, error);
      throw error;
    }
  }
}
