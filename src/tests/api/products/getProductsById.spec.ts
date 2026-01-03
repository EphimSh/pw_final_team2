import { test, expect } from "fixtures/api.fixtures";
import { generateProductData } from "data/products/generateProductData";
import { createProductSchema } from "data/schemas/products/create.schema";
import { STATUS_CODES } from "data/statusCode";
import _ from "lodash";
import { validateResponse } from "utils/validation/validateResponse.utils";
import { IProduct } from "data/types/products.types";
import { invalidIds } from "data/products/invalidIds";
import { errorSchema } from "data/schemas/index.schema";
import { TAGS } from "data/tags/tags";
import { TEST_TAG } from "data/types/tags.types";

test.describe("[API] [Sales Portal] [Products] [Get by Id]", () => {
  let id = "";
  let token = "";
  let productData: IProduct;

  test.beforeEach(async ({ loginApiService }) => {
    id = "";
    token = await loginApiService.loginAsAdmin();
    productData = generateProductData();
  });

  test.afterEach(async ({ productsApiService }) => {
    if (id) await productsApiService.delete(token, id);
    id = "";
  });

  test(
    "SC-015: Successful receipt of goods by valid ID",
    { tag: [TAGS.REGRESSION, TAGS.API, TEST_TAG.POSITIVE, TAGS.PRODUCTS] },
    async ({ productsApi }) => {
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
    },
  );

  test(
    "SC-016: Receiving a non-existent product",
    { tag: [TAGS.REGRESSION, TAGS.API, TEST_TAG.NEGATIVE, TAGS.PRODUCTS] },
    async ({ productsApi }) => {
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
    },
  );

  for (const invalidIdCase of invalidIds) {
    test(invalidIdCase.title, async ({ productsApi }) => {
      const getProductResponse = await productsApi.getById(invalidIdCase.requestId, token);
      expect(getProductResponse.status).toBe(invalidIdCase.expectedStatus);
    });
  }
});
