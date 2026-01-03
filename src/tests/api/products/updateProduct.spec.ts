import { test, expect } from "fixtures/api.fixtures";
import { generateProductData } from "data/products/generateProductData";
import { STATUS_CODES } from "data/statusCode";
import _ from "lodash";
import { validateResponse } from "utils/validation/validateResponse.utils";
import { ObjectId } from "bson";
import { updateProductSchema } from "data/schemas/products";
import { errorSchema } from "data/schemas/core.schema";
import { TAGS } from "data/tags/tags";
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
    "SC-018: Полное обновление товара",
    { tag: [TAGS.REGRESSION, TEST_TAG.SMOKE, TEST_TAG.API, TEST_TAG.POSITIVE, COMPONENT_TAG.PRODUCTS] },
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
    "SC-019: Частичное обновление (только цена)",
    { tag: [TAGS.REGRESSION, TAGS.POSITIVE, TAGS.API, COMPONENT_TAG.PRODUCTS] },
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
    "SC-020: Обновление несуществующего товара",
    { tag: [TAGS.REGRESSION, TAGS.API, TEST_TAG.NEGATIVE, COMPONENT_TAG.PRODUCTS] },
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
    "SC-021: Обновление с невалидным name",
    { tag: [TAGS.REGRESSION, TAGS.API, TEST_TAG.NEGATIVE, COMPONENT_TAG.PRODUCTS] },
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
    "SC-022: Обновление с отрицательным amount",
    { tag: [TAGS.REGRESSION, TAGS.API, TEST_TAG.NEGATIVE, COMPONENT_TAG.PRODUCTS] },
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
