import { getAllProductsSchema } from "data/schemas/products";
import { STATUS_CODES } from "data/statusCode";
import { ICase, SortOrder } from "data/types/core.types";
import { IProductFromResponse, ProductsSortField } from "data/types/products.types";

export interface ISearchTestCase extends ICase {
  getSearchValue: (product: IProductFromResponse) => string;
  expectedStatus: number;
  expectedIsSuccess: boolean;
  expectedErrorMessage: string | null;
  expectedSchema?: object;
  sortField: ProductsSortField;
  sortOrder: SortOrder;
}
// There's an issue with test case IDs, suggest fixing them later.
// Leave as is for now
export const searchTestCases: ISearchTestCase[] = [
  {
    title: "SC-010: Search product by name",
    getSearchValue: (product) => product.name,
    expectedStatus: STATUS_CODES.OK,
    expectedIsSuccess: true,
    expectedErrorMessage: null,
    expectedSchema: getAllProductsSchema,
    sortField: "createdOn",
    sortOrder: "desc",
  },
  {
    title: "SC-010: Search product by price (string search)",
    getSearchValue: (product) => product.price.toString(),
    expectedStatus: STATUS_CODES.OK,
    expectedIsSuccess: true,
    expectedErrorMessage: null,
    expectedSchema: getAllProductsSchema,
    sortField: "createdOn",
    sortOrder: "desc",
  },
  {
    title: "SC-010: Search product by manufacturer",
    getSearchValue: (product) => product.manufacturer,
    expectedStatus: STATUS_CODES.OK,
    expectedIsSuccess: true,
    expectedErrorMessage: null,
    expectedSchema: getAllProductsSchema,
    sortField: "createdOn",
    sortOrder: "desc",
  },
];
