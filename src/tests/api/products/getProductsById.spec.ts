import { test, expect } from "fixtures/api.fixtures";
import { generateProductData } from "data/products/generateProductData";
import { createProductSchema } from "data/schemas/products/create.schema";
import { STATUS_CODES } from "data/statusCode";
import _ from "lodash";
import { validateResponse } from "utils/validation/validateResponse.utils";
import { IProduct } from "data/types/products.types";
import { invalidIds } from "data/products/invalidIds";
import { errorSchema } from "data/schemas/core.schema";

test.describe("[API] [Sales Portal] [Products] [Get by Id]", () => {
  let id = "";
  let token = "";
  let productData: IProduct;

  test.beforeEach(async ({ loginApiService }) => {
    token = await loginApiService.loginAsAdmin();
    productData = generateProductData();
  });

  test.afterEach(async ({ productsApiService }) => {
    if (id) await productsApiService.delete(token, id);
  });

  test("SC-015: Successful receipt of goods by valid ID", async ({ productsApi }) => {
    const createdProduct = await productsApi.create(productData, token);
    validateResponse(createdProduct, {
      status: STATUS_CODES.CREATED,
      schema: createProductSchema,
      IsSuccess: true,
      ErrorMessage: null,
    });

    id = createdProduct.body.Product._id;
    const actualProductData = createdProduct.body.Product;
    expect(_.omit(actualProductData, ["_id", "createdOn"])).toEqual(productData);

    const retrievedProduct = await productsApi.getById(id, token);
    console.log(JSON.stringify(retrievedProduct));
    expect(retrievedProduct.body.Product._id).toBe(id);
  });

  test("SC-016: Receiving a non-existent product", async ({ productsApi }) => {
    const nonExistentId = "507f1f77bcf86cd799439011";
    const getProductResponse = await productsApi.getById(nonExistentId, token);

    validateResponse(getProductResponse, {
      status: STATUS_CODES.NOT_FOUND,
      schema: errorSchema,
      IsSuccess: false,
      ErrorMessage: null,
    });

    const response = await productsApi.getById(nonExistentId, token);
    expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
  });

  test("SC-017: Invalid product ID format", async ({ productsApi }) => {
    for (const invalidId of invalidIds) {
      const getProductResponse = await productsApi.getById(invalidId, token);
      expect(getProductResponse.status).toBe(STATUS_CODES.BAD_REQUEST);
    }
  });
});
