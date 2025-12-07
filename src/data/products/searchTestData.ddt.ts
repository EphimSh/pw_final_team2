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
//с id кейсов у нас проблемка, предлагаю позже привести их в порядок.
//пока оставить как есть
export const searchTestCases: ISearchTestCase[] = [
  {
    title: "SC-010: Поиск товара по названию",
    getSearchValue: (product) => product.name,
    expectedStatus: STATUS_CODES.OK,
    expectedIsSuccess: true,
    expectedErrorMessage: null,
    expectedSchema: getAllProductsSchema,
    sortField: "createdOn",
    sortOrder: "desc",
  },
  {
    title: "SC-010: Поиск товара по цене (строковый поиск)",
    getSearchValue: (product) => product.price.toString(),
    expectedStatus: STATUS_CODES.OK,
    expectedIsSuccess: true,
    expectedErrorMessage: null,
    expectedSchema: getAllProductsSchema,
    sortField: "createdOn",
    sortOrder: "desc",
  },
  {
    title: "SC-010: Поиск товара по производителю",
    getSearchValue: (product) => product.manufacturer,
    expectedStatus: STATUS_CODES.OK,
    expectedIsSuccess: true,
    expectedErrorMessage: null,
    expectedSchema: getAllProductsSchema,
    sortField: "createdOn",
    sortOrder: "desc",
  },
];
