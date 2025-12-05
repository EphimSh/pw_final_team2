import { IApiClient } from "api/apiClients/types";
import { apiConfig } from "config/apiConfig";
import { IRequestOptions } from "data/types/core.types";
import {
  IGetProductsParams,
  IProduct,
  IProductResponse,
  IProductsResponse,
  IProductsSortedResponse,
} from "data/types/products.types";
import { convertRequestParams } from "utils/queryParams.utils";

export class ProductsApi {
  constructor(private apiClient: IApiClient) {}

  // POST /api/products
  async create(product: IProduct, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL, //backend url
      url: apiConfig.endpoints.products, //endpoint address
      method: "post",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: product,
    };

    try {
      return await this.apiClient.send<IProductResponse>(options);
    } catch (error) {
      console.error(`Failed to create product ${product.name}:`, error);
      throw error; // или обработать по-другому
    }
  }

  // PUT /api/products by id
  async update(_id: string, newProduct: IProduct, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints.productById(_id),
      method: "put",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: newProduct,
    };

    try {
      return await this.apiClient.send<IProductResponse>(options);
    } catch (error) {
      console.error(`Failed to update product ${_id}:`, error);
      throw error;
    }
  }

  // GET /api/products by id
  async getById(_id: string, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints.productById(_id),
      method: "get",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      return await this.apiClient.send<IProductResponse>(options);
    } catch (error) {
      console.error(`Failed to get product by id ${_id}:`, error);
      throw error;
    }
  }

  // GET /api/products/all
  async getAll(token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints.productsAll,
      method: "get",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      return await this.apiClient.send<IProductsResponse>(options);
    } catch (error) {
      console.error(`Failed to get all products:`, error);
      throw error;
    }
  }

  // GET /api/products with sorting
  async getSorted(token: string, params?: Partial<IGetProductsParams>) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints.products + (params ? convertRequestParams(params) : ""),
      method: "get",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      return await this.apiClient.send<IProductsSortedResponse>(options);
    } catch (error) {
      console.error(`Failed to get products with sorting by ${params?.sortField}:`, error);
      throw error;
    }
  }

  // DELETE /api/products by id
  async delete(_id: string, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints.productById(_id),
      method: "delete",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      return await this.apiClient.send<null>(options);
    } catch (error) {
      console.error(`Failed to delete product by id ${_id}:`, error);
      throw error;
    }
  }
}
