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

  async create(product: IProduct, token: string, opts?: { contentType?: string }) {
    const contentType = opts?.contentType ?? "application/json";
    const payload = contentType === "application/json" ? product : JSON.stringify(product);

    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints.products,
      method: "post",
      headers: {
        "content-type": contentType,
        Authorization: `Bearer ${token}`,
      },
      data: payload,
    };

    return await this.apiClient.send<IProductResponse>(options);
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

    return await this.apiClient.send<IProductResponse>(options);
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

    return await this.apiClient.send<IProductResponse>(options);
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

    return await this.apiClient.send<IProductsResponse>(options);
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

    return await this.apiClient.send<IProductsSortedResponse>(options);
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

    return await this.apiClient.send<null>(options);
  }
}
