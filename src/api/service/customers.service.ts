import { CustomersApi } from "api/api/customers.api";
import { generateCustomerData } from "data/customers/generateCustomerData";
import {
  createCustomerSchema,
  getAllCustomersSchema,
  getCustomerSchema,
  updateCustomerSchema,
} from "data/schemas/customers";
import { ICustomer, ICustomerFromResponse, ICustomerResponse, IGetCustomersParams } from "data/types/customers.types";
import { STATUS_CODES } from "data/statusCode";
import { validateResponse } from "utils/validation/validateResponse.utils";
import { IResponse } from "data/types/core.types";
import { expect } from "fixtures";

export class CustomersApiService {
  constructor(private customersApi: CustomersApi) {}

  async create(token: string, customerData?: Partial<ICustomer>) {
    const data = generateCustomerData(customerData);
    const response = await this.customersApi.create(data, token);
    validateResponse(response, {
      status: STATUS_CODES.CREATED,
      IsSuccess: true,
      ErrorMessage: null,
      schema: createCustomerSchema,
    });
    return response.body.Customer;
  }

  async getAll(token: string) {
    const response = await this.customersApi.getAll(token);
    validateResponse(response, {
      status: STATUS_CODES.OK,
      IsSuccess: true,
      ErrorMessage: null,
      schema: getAllCustomersSchema,
    });
    return response.body.Customers;
  }

  async getById(id: string, token: string) {
    const response = await this.customersApi.getById(id, token);
    validateResponse(response, {
      status: STATUS_CODES.OK,
      IsSuccess: true,
      ErrorMessage: null,
      schema: getCustomerSchema,
    });
    return response.body.Customer;
  }

  async getSorted(token: string, params?: Partial<IGetCustomersParams>) {
    const response = await this.customersApi.getSorted(token, params);
    validateResponse(response, {
      status: STATUS_CODES.OK,
      IsSuccess: true,
      ErrorMessage: null,
      schema: getAllCustomersSchema,
    });
    return response.body.Customers;
  }

  async update(id: string, token: string, newCustomerData?: Partial<ICustomer>) {
    const data = generateCustomerData(newCustomerData);
    const response = await this.customersApi.update(id, data, token);
    validateResponse(response, {
      status: STATUS_CODES.OK,
      IsSuccess: true,
      ErrorMessage: null,
      schema: updateCustomerSchema,
    });
    return response.body.Customer;
  }

  async delete(token: string, id: string) {
    const response = await this.customersApi.delete(id, token);
    validateResponse(response, {
      status: STATUS_CODES.DELETED,
    });
  }

  assertCustomerUpdated(actualCustomer: ICustomerFromResponse, updatedCustomerData: IResponse<ICustomerResponse>) {
    expect(actualCustomer).not.toBe(updatedCustomerData.body);
  }

  async deleteAllCustomers(ids: string[], token: string) {
    for (const id of ids) {
      if (!id) continue;
      try {
        await this.delete(token, id);
      } catch (error: unknown) {
        const status = (error as { response?: { status?: number } }).response?.status;
        if (status === 404) continue;
        throw error;
      }
    }
    ids.length = 0;
  }
}
