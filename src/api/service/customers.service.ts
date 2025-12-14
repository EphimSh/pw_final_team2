import { CustomersApi } from "api/api/customers.api";
import { generateCustomerData } from "data/customers/generateCustomerData";
import {
  createCustomerSchema,
  getAllCustomersSchema,
  getCustomerSchema,
  updateCustomerSchema,
} from "data/schemas/customers";

import {
  CustomersTableHeader,
  ICustomer,
  ICustomerFromResponse,
  ICustomerResponse,
  ICustomersSortedResponse,
  IGetCustomersParams,
} from "data/types/customers.types";

import { STATUS_CODES } from "data/statusCode";
import { validateResponse } from "utils/validation/validateResponse.utils";
import { IResponse, SortOrder } from "data/types/core.types";
import { expect } from "@playwright/test";

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

  async assertCustomerInList(response: IResponse<ICustomersSortedResponse>, customer: ICustomerFromResponse) {
    const found = response.body.Customers.find((el) => el._id === customer._id);
    expect.soft(found, "Created customer should be in response").toBeTruthy();
  }

  async assertProductInSortedList(
    response: IResponse<ICustomersSortedResponse>,
    options?: {
      customer?: ICustomerFromResponse;
      searchField?: string;
      sortField?: CustomersTableHeader;
      sortOrder?: SortOrder;
      minCustomersTotal?: number;
    },
  ) {
    const { limit, search, country, total, page, sorting } = response.body;
    if (options?.customer) {
      await this.assertCustomerInList(response, options.customer);
    }
    expect.soft(limit, `Limit should be ${limit}`).toBe(10);
    expect.soft(search).toBe(options?.searchField ?? "");
    expect.soft(country).toEqual([]);
    expect.soft(page).toBe(1);
    expect
      .soft(sorting)
      .toEqual({ sortField: options?.sortField ?? "createdOn", sortOrder: options?.sortOrder ?? "desc" });
    expect.soft(total).toBeGreaterThanOrEqual(options?.minCustomersTotal ?? 1);
  }
}
