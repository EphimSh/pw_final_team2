import { ICustomerFromResponse } from "data/types/customers.types";

export const compareByCreatedOnAsc = (a: ICustomerFromResponse, b: ICustomerFromResponse) =>
  new Date(a.createdOn).getTime() - new Date(b.createdOn).getTime();

export const compareByCreatedOnDesc = (a: ICustomerFromResponse, b: ICustomerFromResponse) =>
  new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime();

export const compareByNameAsc = (a: ICustomerFromResponse, b: ICustomerFromResponse) => a.name.localeCompare(b.name);

export const compareByNameDesc = (a: ICustomerFromResponse, b: ICustomerFromResponse) =>
  b.name.toLowerCase().localeCompare(a.name.toLowerCase());

export const compareByCountryAsc = (a: ICustomerFromResponse, b: ICustomerFromResponse) => {
  const byCountry = a.country.localeCompare(b.country);
  if (byCountry !== 0) return byCountry;
  return compareByCreatedOnAsc(a, b);
};

export const compareByCountryDesc = (a: ICustomerFromResponse, b: ICustomerFromResponse) => {
  const byCountry = b.country.localeCompare(a.country);
  if (byCountry !== 0) return byCountry;
  return compareByCreatedOnDesc(a, b);
};
