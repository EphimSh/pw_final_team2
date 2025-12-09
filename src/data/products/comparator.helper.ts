import { IProductFromResponse } from "data/types/products.types";

export const compareByCreatedOnAsc = (a: IProductFromResponse, b: IProductFromResponse) =>
  new Date(a.createdOn).getTime() - new Date(b.createdOn).getTime();

export const compareByCreatedOnDesc = (a: IProductFromResponse, b: IProductFromResponse) =>
  new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime();

export const compareByManufacturerDesc = (a: IProductFromResponse, b: IProductFromResponse) => {
  const byManufacturer = b.manufacturer.localeCompare(a.manufacturer);
  if (byManufacturer !== 0) return byManufacturer;
  return compareByCreatedOnDesc(a, b);
};
