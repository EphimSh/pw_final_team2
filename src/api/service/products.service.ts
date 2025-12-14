import { ProductsApi } from "api/api/products.api";
import { generateProductData } from "data/products/generateProductData";
import {
  createProductSchema,
  getAllProductsSchema,
  getProductSchema,
  updateProductSchema,
} from "data/schemas/products";
import {
  IGetProductsParams,
  IProduct,
  IProductFromResponse,
  IProductsResponse,
  IProductsSortedResponse,
  ProductsSortField,
} from "data/types/products.types";
import { STATUS_CODES } from "data/statusCode";
import { validateResponse } from "utils/validation/validateResponse.utils";
import { IResponse, SortOrder } from "data/types/core.types";
import { expect } from "@playwright/test";

export class ProductsApiService {
  constructor(private productsApi: ProductsApi) {}

  async create(token: string, productData?: Partial<IProduct>) {
    const data = generateProductData(productData);
    const response = await this.productsApi.create(data, token);
    validateResponse(response, {
      status: STATUS_CODES.CREATED,
      IsSuccess: true,
      ErrorMessage: null,
      schema: createProductSchema,
    });
    return response.body.Product;
  }

  async getAll(token: string) {
    const response = await this.productsApi.getAll(token);
    validateResponse(response, {
      status: STATUS_CODES.OK,
      IsSuccess: true,
      ErrorMessage: null,
      schema: getAllProductsSchema,
    });
    return response.body.Products;
  }

  async getById(id: string, token: string) {
    const response = await this.productsApi.getById(id, token);
    validateResponse(response, {
      status: STATUS_CODES.OK,
      IsSuccess: true,
      ErrorMessage: null,
      schema: getProductSchema,
    });
    return response.body.Product;
  }

  async getSorted(token: string, params?: Partial<IGetProductsParams>) {
    const response = await this.productsApi.getSorted(token, params);
    validateResponse(response, {
      status: STATUS_CODES.OK,
      IsSuccess: true,
      ErrorMessage: null,
      schema: getAllProductsSchema,
    });
    return response.body.Products;
  }

  async update(id: string, token: string, newProductData?: Partial<IProduct>) {
    const data = generateProductData(newProductData);
    const response = await this.productsApi.update(id, data, token);
    validateResponse(response, {
      status: STATUS_CODES.OK,
      IsSuccess: true,
      ErrorMessage: null,
      schema: updateProductSchema,
    });
    return response.body.Product;
  }

  async delete(token: string, id: string) {
    const response = await this.productsApi.delete(id, token);
    validateResponse(response, {
      status: STATUS_CODES.DELETED,
    });
  }

  async assertProductInSortedList(
    response: IResponse<IProductsSortedResponse>,
    product?: IProductFromResponse,
    sortField?: ProductsSortField,
    sortOrder?: SortOrder,
    expectedSearch?: string,
  ) {
    const { limit, search, manufacturer, total, page, sorting } = response.body;
    await this.assertProductInList(response, product!);
    const searchValue = expectedSearch;
    expect.soft(limit, `Limit should be ${limit}`).toBe(10);
    expect.soft(search).toBe(searchValue);
    expect.soft(manufacturer).toEqual([]);
    expect.soft(page).toBe(1);
    expect.soft(sorting).toEqual({ sortField, sortOrder });
    expect.soft(total).toBeGreaterThanOrEqual(1);
  }

  async assertProductInList(response: IResponse<IProductsResponse>, product: IProductFromResponse) {
    const found = response.body.Products.find((el) => el._id === product._id);
    expect.soft(found, "Created product should be in response").toBeTruthy();
  }

  async assertProductsInList(response: IResponse<IProductsResponse>, products: IProductFromResponse[]) {
    for (const product of products) {
      await this.assertProductInList(response, product);
    }
  }

  async assertSortedResponseMeta(
    response: IResponse<IProductsSortedResponse>,
    sortField: ProductsSortField,
    sortOrder: SortOrder,
    expectedLimit: number,
    minTotal = 1,
  ) {
    const { limit, manufacturer, total, page, sorting } = response.body;
    expect.soft(limit, `Limit should be ${expectedLimit}`).toBe(expectedLimit);
    expect.soft(manufacturer).toEqual([]);
    expect.soft(page).toBe(1);
    expect.soft(sorting).toEqual({ sortField, sortOrder });
    expect.soft(total).toBeGreaterThanOrEqual(minTotal);
  }
}
