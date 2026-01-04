import { test, expect } from "fixtures/api.fixtures";
import { generateProductData } from "data/products/generateProductData";
import { createProductSchema } from "data/schemas/products/create.schema";
import { STATUS_CODES } from "data/statusCode";
import _ from "lodash";
import { validateResponse } from "utils/validation/validateResponse.utils";
import { IProduct } from "data/types/products.types";
import { errorSchema } from "data/schemas/core.schema";
import { TEST_TAG, COMPONENT_TAG } from "data/types/tags.types";

test.describe("[API] [Sales Portal] [Products] [Create]", () => {
  let id = "";
  let token = "";
  let productData: IProduct;

  test.beforeEach(async ({ loginApiService }) => {
    token = await loginApiService.loginAsAdmin();
    productData = generateProductData();
    id = "";
  });

  test.afterEach(async ({ productsApiService }) => {
    if (id) await productsApiService.delete(token, id);
    id = "";
  });

  test("SC-001: Successful product creation with all fields", async ({ productsApi }) => {
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
  });

  test(
    "SC-002: Create product without optional field notes",
    { tag: [TEST_TAG.REGRESSION, TEST_TAG.API, TEST_TAG.POSITIVE, COMPONENT_TAG.PRODUCTS] },
    async ({ productsApi }) => {
      if (productData.notes) delete productData.notes;
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
    },
  );

  test(
    "SC-003: Missing required field name",
    { tag: [TEST_TAG.REGRESSION, TEST_TAG.API, TEST_TAG.NEGATIVE, COMPONENT_TAG.PRODUCTS] },
    async ({ productsApi }) => {
      productData.name = undefined!;
      const createdProduct = await productsApi.create(productData, token);
      validateResponse(createdProduct, {
        status: STATUS_CODES.BAD_REQUEST,
        schema: errorSchema,
        IsSuccess: false,
        ErrorMessage: "Incorrect request body",
      });
    },
  );

  test(
    "SC-004: Invalid manufacturer (not from enum list)",
    { tag: [TEST_TAG.REGRESSION, TEST_TAG.API, TEST_TAG.NEGATIVE, COMPONENT_TAG.PRODUCTS] },
    async ({ productsApi }) => {
      productData.manufacturer = "Huawei";
      const createdProduct = await productsApi.create(productData, token);
      validateResponse(createdProduct, {
        status: STATUS_CODES.BAD_REQUEST,
        schema: errorSchema,
        IsSuccess: false,
        ErrorMessage: "Incorrect request body",
      });
    },
  );

  test(
    "SC-005: Negative numbers in amount and price",
    { tag: [TEST_TAG.REGRESSION, TEST_TAG.API, TEST_TAG.NEGATIVE, COMPONENT_TAG.PRODUCTS] },
    async ({ productsApi }) => {
      productData.price = -10;
      productData.amount = -100;
      const createdProduct = await productsApi.create(productData, token);
      validateResponse(createdProduct, {
        status: STATUS_CODES.BAD_REQUEST,
        schema: errorSchema,
        IsSuccess: false,
        ErrorMessage: "Incorrect request body",
      });
    },
  );

  test(
    "SC-006: Incorrect Content-Type",
    { tag: [TEST_TAG.REGRESSION, TEST_TAG.API, TEST_TAG.NEGATIVE, COMPONENT_TAG.PRODUCTS] },
    async ({ productsApi }) => {
      const createdProduct = await productsApi.create(productData, token, { contentType: "text/plain" });
      validateResponse(createdProduct, {
        status: STATUS_CODES.BAD_REQUEST,
        schema: errorSchema,
        IsSuccess: false,
        ErrorMessage: "Incorrect request body",
      });
    },
  );
});
