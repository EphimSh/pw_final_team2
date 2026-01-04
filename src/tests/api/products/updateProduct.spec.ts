import { test, expect } from "fixtures/api.fixtures";
import { generateProductData } from "data/products/generateProductData";
import { STATUS_CODES } from "data/statusCode";
import _ from "lodash";
import { validateResponse } from "utils/validation/validateResponse.utils";
import { ObjectId } from "bson";
import { updateProductSchema } from "data/schemas/products";
import { errorSchema } from "data/schemas/core.schema";
import { COMPONENT_TAG, TEST_TAG } from "data/types/tags.types";

test.describe("[API] [Sales Portal] [Products] [Update]", () => {
  let id = "";
  let token = "";
  const updatedProductData = generateProductData();

  test.beforeAll(async ({ loginApiService, productsApiService }) => {
    token = await loginApiService.loginAsAdmin();
    const createdProduct = await productsApiService.create(token);
    id = createdProduct._id;
  });

  test.afterEach(async ({ productsApiService }) => {
    if (id) await productsApiService.delete(token, id);
  });

  test(
    "SC-018: Full product update",
    { tag: [TEST_TAG.REGRESSION, TEST_TAG.SMOKE, TEST_TAG.API, TEST_TAG.POSITIVE, COMPONENT_TAG.PRODUCTS] },
    async ({ productsApi }) => {
      const updatedProductResponse = await productsApi.update(id, updatedProductData, token);

      validateResponse(updatedProductResponse, {
        status: STATUS_CODES.OK,
        schema: updateProductSchema,
        IsSuccess: true,
        ErrorMessage: null,
      });

      const updatedProduct = updatedProductResponse.body.Product;
      expect(_.omit(updatedProduct, ["_id", "createdOn"])).toEqual(updatedProductData);
      expect(id).toBe(updatedProduct._id);
    },
  );

  test(
    "SC-019: Partial update (price only)",
    { tag: [TEST_TAG.REGRESSION, TEST_TAG.POSITIVE, TEST_TAG.API, COMPONENT_TAG.PRODUCTS] },
    async ({ productsApi }) => {
      const updateDataWithEditPrice = updatedProductData;
      updateDataWithEditPrice.price = 10000;
      const updatedProductResponse = await productsApi.update(id, updateDataWithEditPrice, token);

      validateResponse(updatedProductResponse, {
        status: STATUS_CODES.OK,
        schema: updateProductSchema,
        IsSuccess: true,
        ErrorMessage: null,
      });

      const updatedProduct = updatedProductResponse.body.Product;
      expect(_.omit(updatedProduct, ["_id", "createdOn"])).toEqual(updateDataWithEditPrice);
      expect(id).toBe(updatedProduct._id);
    },
  );

  test(
    "SC-020: Update non-existent product",
    { tag: [TEST_TAG.REGRESSION, TEST_TAG.API, TEST_TAG.NEGATIVE, COMPONENT_TAG.PRODUCTS] },
    async ({ productsApi }) => {
      const invalidId = new ObjectId().toHexString();
      const updatedProductResponse = await productsApi.update(invalidId, updatedProductData, token);

      validateResponse(updatedProductResponse, {
        status: STATUS_CODES.NOT_FOUND,
        IsSuccess: false,
        schema: errorSchema,
        ErrorMessage: `Product with id '${invalidId}' wasn't found`,
      });
    },
  );

  test(
    "SC-021: Update with invalid name",
    { tag: [TEST_TAG.REGRESSION, TEST_TAG.API, TEST_TAG.NEGATIVE, COMPONENT_TAG.PRODUCTS] },
    async ({ productsApi }) => {
      const updateDataWithInvalidName = updatedProductData;
      updateDataWithInvalidName.name = "qa";
      const updatedProductResponse = await productsApi.update(id, updateDataWithInvalidName, token);

      validateResponse(updatedProductResponse, {
        status: STATUS_CODES.BAD_REQUEST,
        IsSuccess: false,
        schema: errorSchema,
        ErrorMessage: "Incorrect request body",
      });
    },
  );

  test(
    "SC-022: Update with negative amount",
    { tag: [TEST_TAG.REGRESSION, TEST_TAG.API, TEST_TAG.NEGATIVE, COMPONENT_TAG.PRODUCTS] },
    async ({ productsApi }) => {
      const updateDataWithInvalidAmount = updatedProductData;
      updateDataWithInvalidAmount.amount = -10000;
      const updatedProductResponse = await productsApi.update(id, updateDataWithInvalidAmount, token);

      validateResponse(updatedProductResponse, {
        status: STATUS_CODES.BAD_REQUEST,
        schema: errorSchema,
        IsSuccess: false,
        ErrorMessage: "Incorrect request body",
      });
    },
  );
});
