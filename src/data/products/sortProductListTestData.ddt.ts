import {
  compareByCreatedOnAsc,
  compareByCreatedOnDesc,
  compareByManufacturerDesc,
} from "data/products/comparator.helper";
import { getAllProductsSchema } from "data/schemas/products";
import { STATUS_CODES } from "data/statusCode";
import { ICase, SortOrder } from "data/types/core.types";
import { IProductFromResponse, ProductsSortField } from "data/types/products.types";

export interface ISortProductsTestCase extends ICase {
  sortField: ProductsSortField;
  sortOrder: SortOrder;
  compareFn: (a: IProductFromResponse, b: IProductFromResponse) => number;
  expectedStatus: number;
  expectedIsSuccess: boolean;
  expectedErrorMessage: string | null;
  expectedSchema?: object;
}

export const sortProductListTestCases: ISortProductsTestCase[] = [
  {
    title: "SC-012: Сортировка по createdOn (asc)",
    sortField: "createdOn",
    sortOrder: "asc",
    compareFn: compareByCreatedOnAsc,
    expectedStatus: STATUS_CODES.OK,
    expectedIsSuccess: true,
    expectedErrorMessage: null,
    expectedSchema: getAllProductsSchema,
  },
  {
    title: "SC-012: Сортировка по createdOn (desc)",
    sortField: "createdOn",
    sortOrder: "desc",
    compareFn: compareByCreatedOnDesc,
    expectedStatus: STATUS_CODES.OK,
    expectedIsSuccess: true,
    expectedErrorMessage: null,
    expectedSchema: getAllProductsSchema,
  },
  {
    title: "SC-011: Сортировка по manufacturer (desc)",
    sortField: "manufacturer",
    sortOrder: "desc",
    compareFn: compareByManufacturerDesc,
    expectedStatus: STATUS_CODES.OK,
    expectedIsSuccess: true,
    expectedErrorMessage: null,
    expectedSchema: getAllProductsSchema,
  },
];
