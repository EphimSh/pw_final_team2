import { ICreatedOn, ID, IResponseFields, SortOrder } from "./core.types";
import { COUNTRIES } from "./countries";

export interface ICustomer {
  email: string;
  name: string;
  country: COUNTRIES;
  city: string;
  street: string;
  house: number;
  flat: number;
  phone: string;
  notes?: string;
}

export interface ICustomerFromTable {
  email: string;
  name: string;
  country: COUNTRIES;
}

export interface ICustomerFromResponse extends Required<ICustomer>, ICreatedOn, ID {}

export interface ICustomerResponse extends IResponseFields {
  Customer: ICustomerFromResponse;
}

export interface ICustomersResponse extends IResponseFields {
  Customers: ICustomerFromResponse[];
}

export interface ICustomerInTable extends ICustomerFromTable, ICreatedOn {}

export type CustomersTableHeader = "Email" | "Name" | "Country" | "Created On";

export type CustomersSortField = "email" | "name" | "country" | "createdOn";

export interface IGetCustomersParams {
  search: string;
  country: COUNTRIES[];
  sortField: CustomersTableHeader;
  sortOrder: SortOrder;
  page: number;
  limit: number;
}

export interface ICustomersSortedResponse extends ICustomersResponse {
  total: number;
  page: number;
  limit: number;
  search: string;
  country: COUNTRIES[];
  sorting: {
    sortField: CustomersSortField;
    sortOrder: SortOrder;
  };
}
