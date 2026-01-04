import { createProductNegativeCases, createProductPositiveCases } from "data/products/createProducts.ddt";
import { generateProductData } from "data/products/generateProductData";
import { createProductSchema } from "data/schemas/products";
import { STATUS_CODES } from "data/statusCode";
import { IProduct } from "data/types/products.types";
import { COMPONENT_TAG, TEST_TAG } from "data/types/tags.types";
import { expect, test } from "fixtures";
import _ from "lodash";
import { validateResponse } from "utils/validation/validateResponse.utils";

test.describe("[API] [Sales Portal] [Products]", () => {
  let id = "";
  let token = "";

  test.beforeEach(async ({ loginApiService }) => {
    token = await loginApiService.loginAsAdmin();
  });

  test.afterEach(async ({ productsApiService }) => {
    if (id) await productsApiService.delete(token, id);
    id = "";
  });

  test(
    "SC-001: Successful product creation with all fields",
    { tag: [TEST_TAG.REGRESSION, TEST_TAG.SMOKE, TEST_TAG.API, TEST_TAG.POSITIVE, COMPONENT_TAG.PRODUCTS] },
    async ({ productsApi }) => {
      const productData = generateProductData();
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
    "SC-003: Name validation error (name is not a string)",
    { tag: [TEST_TAG.REGRESSION, TEST_TAG.API, TEST_TAG.NEGATIVE, COMPONENT_TAG.PRODUCTS] },
    async ({ productsApi }) => {
      const productData = generateProductData();
      const createdProduct = await productsApi.create({ ...productData, name: 123 } as unknown as IProduct, token);
      validateResponse(createdProduct, {
        status: STATUS_CODES.BAD_REQUEST,
        IsSuccess: false,
        ErrorMessage: "Incorrect request body",
      });
    },
  );

  test.describe("Create products with valid request body", () => {
    for (const caseData of createProductPositiveCases) {
      test(
        `${caseData.title}`,
        { tag: [TEST_TAG.REGRESSION, TEST_TAG.API, TEST_TAG.POSITIVE, COMPONENT_TAG.PRODUCTS] },
        async ({ productsApi }) => {
          const createdProduct = await productsApi.create(caseData.productData as IProduct, token);
          validateResponse(createdProduct, {
            status: caseData.expectedStatus || STATUS_CODES.CREATED,
            schema: createProductSchema,
            IsSuccess: true,
            ErrorMessage: null,
          });

          id = createdProduct.body.Product._id;

          const actualProductData = createdProduct.body.Product;
          expect(_.omit(actualProductData, ["_id", "createdOn"])).toEqual(caseData.productData);
        },
      );
    }
  });

  test.describe("Cannot create product with invalid request body", () => {
    for (const caseData of createProductNegativeCases) {
      test(
        `${caseData.title}`,
        { tag: [TEST_TAG.REGRESSION, TEST_TAG.API, TEST_TAG.NEGATIVE, COMPONENT_TAG.PRODUCTS] },
        async ({ productsApi }) => {
          const createdProduct = await productsApi.create(caseData.productData as IProduct, token);
          validateResponse(createdProduct, {
            status: caseData.expectedStatus || STATUS_CODES.BAD_REQUEST,
            IsSuccess: false,
            ErrorMessage: "Incorrect request body",
          });
        },
      );
    }
  });
});
