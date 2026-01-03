import { test, expect } from "fixtures/api.fixtures";
import { STATUS_CODES } from "data/statusCode";
import { validateResponse } from "utils/validation/validateResponse.utils";
import { getAllProductsSchema } from "data/schemas/products/getAll.schema";
import { MANUFACTURERS } from "data/types/manufacturers";
import { productsForCreation } from "data/products/productsForCreation";
import { COMPONENT_TAG, TEST_TAG } from "data/types/tags.types";

test.describe("[API][Sales Portal][Products][Positive] Get All Products", () => {
  const ids: string[] = [];
  let token = "";

  test.beforeAll(async ({ loginApiService, productsApiService }) => {
    token = await loginApiService.loginAsAdmin();
    for (const product of productsForCreation) {
      const createdProduct = await productsApiService.create(token, product);
      ids.push(createdProduct._id);
    }
  });

  test.afterAll(async ({ productsApiService }) => {
    if (ids.length) {
      for (const id of ids) await productsApiService.delete(token, id);
    }
  });

  test(
    "SC-007: Receiving goods without parameters",
    { tag: [TEST_TAG.REGRESSION, TEST_TAG.API, TEST_TAG.POSITIVE, COMPONENT_TAG.PRODUCTS] },
    async ({ productsApi }) => {
      const getProductResponse = await productsApi.getAll(token);

      validateResponse(getProductResponse, {
        status: STATUS_CODES.OK,
        schema: getAllProductsSchema,
        IsSuccess: true,
        ErrorMessage: null,
      });
    },
  );

  test(
    "SC-008: Filter by one manufacturer",
    { tag: [TEST_TAG.SMOKE, TEST_TAG.REGRESSION, TEST_TAG.API, TEST_TAG.POSITIVE, COMPONENT_TAG.PRODUCTS] },
    async ({ productsApi }) => {
      const getProductResponse = await productsApi.getSorted(token, { manufacturer: [MANUFACTURERS.APPLE] });

      validateResponse(getProductResponse, {
        status: STATUS_CODES.OK,
        schema: getAllProductsSchema,
        IsSuccess: true,
        ErrorMessage: null,
      });

      expect(
        getProductResponse.body.Products.every((product) => product.manufacturer === MANUFACTURERS.APPLE),
        'All products should have "Apple" manufacturer',
      ).toBeTruthy();
    },
  );

  test(
    "SC-009: Filter by multiple manufacturers",
    { tag: [TEST_TAG.REGRESSION, TEST_TAG.API, TEST_TAG.POSITIVE, COMPONENT_TAG.PRODUCTS] },
    async ({ productsApi }) => {
      const getProductResponse = await productsApi.getSorted(token, {
        manufacturer: [MANUFACTURERS.APPLE, MANUFACTURERS.SAMSUNG],
      });

      validateResponse(getProductResponse, {
        status: STATUS_CODES.OK,
        schema: getAllProductsSchema,
        IsSuccess: true,
        ErrorMessage: null,
      });

      expect(
        getProductResponse.body.Products.every(
          (product) => product.manufacturer === MANUFACTURERS.APPLE || product.manufacturer === MANUFACTURERS.SAMSUNG,
        ),
        'All products should have "Apple" or "Samsung" manufacturer',
      ).toBeTruthy();
    },
  );

  test(
    "SC-010: Search by product name",
    { tag: [TEST_TAG.SMOKE, TEST_TAG.REGRESSION, TEST_TAG.API, TEST_TAG.POSITIVE, COMPONENT_TAG.PRODUCTS] },
    async ({ productsApi }) => {
      const valueForSearch = "iPhone";
      const getProductResponse = await productsApi.getSorted(token, {
        search: valueForSearch,
      });

      validateResponse(getProductResponse, {
        status: STATUS_CODES.OK,
        schema: getAllProductsSchema,
        IsSuccess: true,
        ErrorMessage: null,
      });

      expect(
        getProductResponse.body.Products.every((product) =>
          product.name!.toLowerCase().includes(valueForSearch.toLowerCase()),
        ),
        `All products should have ${valueForSearch} in name`,
      ).toBeTruthy();
    },
  );

  test(
    "SC-011: Sort by price, ascending",
    { tag: [TEST_TAG.REGRESSION, TEST_TAG.API, TEST_TAG.POSITIVE, COMPONENT_TAG.PRODUCTS] },
    async ({ productsApi, productsApiService }) => {
      const getProductResponse = await productsApi.getSorted(token, {
        sortField: "price",
        sortOrder: "asc",
        page: 1,
        limit: 100,
      });

      validateResponse(getProductResponse, {
        status: STATUS_CODES.OK,
        schema: getAllProductsSchema,
        IsSuccess: true,
        ErrorMessage: null,
      });

      productsApiService.assertProductsInList(getProductResponse, getProductResponse.body.Products);

      productsApiService.assertSortedResponseMeta(getProductResponse, "price", "asc", 100, 1);

      // const sortedResponse = [...getProductResponse.body.Products].sort((a, b) => a.price - b.price);
      // expect(getProductResponse.body.Products, "Products should be sorted by price in ASC order").toEqual(sortedResponse);
    },
  );

  test(
    "SC-012: Sort by creation date (newest first)",
    { tag: [TEST_TAG.REGRESSION, TEST_TAG.API, TEST_TAG.POSITIVE, COMPONENT_TAG.PRODUCTS] },
    async ({ productsApi }) => {
      const getProductResponse = await productsApi.getSorted(token, {
        sortField: "createdOn",
        sortOrder: "desc",
      });

      validateResponse(getProductResponse, {
        status: STATUS_CODES.OK,
        schema: getAllProductsSchema,
        IsSuccess: true,
        ErrorMessage: null,
      });

      const sortedResponse = [...getProductResponse.body.Products].sort(
        (a, b) => new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime(),
      );

      expect(getProductResponse.body.Products, "Products should be sorted by createdOn in DESC order").toEqual(
        sortedResponse,
      );
    },
  );
});
