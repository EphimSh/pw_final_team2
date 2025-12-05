import { ProductsApi } from "api/api/products.api";
import { generateProductData } from "data/products/generateProductData";
import {
  createProductSchema,
  getAllProductsSchema,
  getProductSchema,
  updateProductSchema,
} from "data/schemas/products";
import { IGetProductsParams, IProduct } from "data/types/products.types";
import { STATUS_CODES } from "data/statusCode";
import { validateResponse } from "utils/validation/validateResponse.utils";

export class ProductsApiService {
  constructor(private productsApi: ProductsApi) {}

  async create(token: string, productData?: IProduct) {
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

  async update(id: string, newProductData: IProduct, token: string) {
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
}
