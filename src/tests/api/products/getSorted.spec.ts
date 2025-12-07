import {
  compareByCreatedOnAsc,
  compareByCreatedOnDesc,
  compareByManufacturerDesc,
} from "data/products/comparator.helper";
import { expectArraySorted } from "data/products/sort.helper";
import { STATUS_CODES } from "data/statusCode";
import { TAGS } from "data/tags/tags";
import { test, expect } from "fixtures/api.fixture";

import { validateResponse } from "utils/validation/validateResponse.utils";

test.describe("[API] [Sales Portal] [Products] Get Sorted", () => {
  test.describe("Search", () => {
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
      "SC-010: Поиск товара по названию",
      { tag: [TAGS.SMOKE, TAGS.REGRESSION, TAGS.API, TAGS.PRODUCTS] },
      async ({ productsApiService, productsApi }) => {
        const product = await productsApiService.create(token);

        const response = await productsApi.getSorted(token, { search: product.name });

        validateResponse(response, {
          status: STATUS_CODES.OK,
          IsSuccess: true,
          ErrorMessage: null,
        });
        const { limit, search, manufacturer, total, page, sorting } = response.body;
        const found = response.body.Products.find((el) => el._id === product._id);
        expect.soft(found, `Created product should be in response`).toBeTruthy();
        expect.soft(limit, `Limit should be ${limit}`).toBe(10);
        expect.soft(search).toBe(product.name);
        expect.soft(manufacturer).toEqual([]);
        expect.soft(page).toBe(1);
        expect.soft(sorting).toEqual({ sortField: "createdOn", sortOrder: "desc" });
        expect.soft(total).toBeGreaterThanOrEqual(1);
      },
    );

    test(
      "SC-010: Поиск товара по цене (строковый поиск)",
      { tag: [TAGS.REGRESSION, TAGS.API, TAGS.PRODUCTS] },
      async ({ productsApiService, productsApi }) => {
        const product = await productsApiService.create(token);

        const response = await productsApi.getSorted(token, { search: product.price.toString() });

        validateResponse(response, {
          status: STATUS_CODES.OK,
          IsSuccess: true,
          ErrorMessage: null,
        });
        const { limit, search, manufacturer, total, page, sorting } = response.body;
        const found = response.body.Products.find((el) => el._id === product._id);
        expect.soft(found, `Created product should be in response`).toBeTruthy();
        expect.soft(limit, `Limit should be ${limit}`).toBe(10);
        expect.soft(search).toBe(product.price.toString());
        expect.soft(manufacturer).toEqual([]);
        expect.soft(page).toBe(1);
        expect.soft(sorting).toEqual({ sortField: "createdOn", sortOrder: "desc" });
        expect.soft(total).toBeGreaterThanOrEqual(1);
      },
    );

    test(
      "SC-010: Поиск товара по производителю",
      { tag: [TAGS.REGRESSION, TAGS.API, TAGS.PRODUCTS] },
      async ({ productsApiService, productsApi }) => {
        const product = await productsApiService.create(token);

        const response = await productsApi.getSorted(token, { search: product.manufacturer });

        validateResponse(response, {
          status: STATUS_CODES.OK,
          IsSuccess: true,
          ErrorMessage: null,
        });
        const { limit, search, manufacturer, total, page, sorting } = response.body;
        const found = response.body.Products.find((el) => el._id === product._id);
        expect.soft(found, `Created product should be in response`).toBeTruthy();
        expect.soft(limit, `Limit should be ${limit}`).toBe(10);
        expect.soft(search).toBe(product.manufacturer);
        expect.soft(manufacturer).toEqual([]);
        expect.soft(page).toBe(1);
        expect.soft(sorting).toEqual({ sortField: "createdOn", sortOrder: "desc" });
        expect.soft(total).toBeGreaterThanOrEqual(1);
      },
    );
  });

  test.describe("Sorting", () => {
    const ids: string[] = [];
    let token = "";

    test.beforeEach(async ({ loginApiService }) => {
      token = await loginApiService.loginAsAdmin();
    });
    test.afterEach(async ({ productsApiService }) => {
      if (ids.length) {
        for (const id of ids) {
          await productsApiService.delete(token, id);
        }
        ids.length = 0;
      }
    });

    test(
      "SC-012: Сортировка по createdOn (asc)",
      { tag: [TAGS.REGRESSION, TAGS.API, TAGS.PRODUCTS] },
      async ({ productsApiService, productsApi, page }) => {
        const product1 = await productsApiService.create(token);
        await page.waitForTimeout(1000);
        const product2 = await productsApiService.create(token);

        ids.push(product1._id, product2._id);
        const response = await productsApi.getSorted(token, { sortField: "createdOn", sortOrder: "asc" });

        validateResponse(response, {
          status: STATUS_CODES.OK,
          IsSuccess: true,
          ErrorMessage: null,
        });

        const actualProducts = response.body.Products;
        expectArraySorted(actualProducts, compareByCreatedOnAsc);

        const { limit, search, manufacturer, total, page: pageParam, sorting } = response.body;
        expect.soft(limit, `Limit should be ${limit}`).toBe(10);
        expect.soft(search).toBe("");
        expect.soft(manufacturer).toEqual([]);
        expect.soft(pageParam).toBe(1);
        expect.soft(sorting).toEqual({ sortField: "createdOn", sortOrder: "asc" });
        expect.soft(total).toBeGreaterThanOrEqual(2);
      },
    );

    test(
      "SC-012: Сортировка по createdOn (desc)",
      { tag: [TAGS.REGRESSION, TAGS.API, TAGS.PRODUCTS] },
      async ({ productsApiService, productsApi, page }) => {
        const product1 = await productsApiService.create(token);
        await page.waitForTimeout(1000);
        const product2 = await productsApiService.create(token);

        ids.push(product1._id, product2._id);
        const response = await productsApi.getSorted(token, { sortField: "createdOn", sortOrder: "desc" });

        validateResponse(response, {
          status: STATUS_CODES.OK,
          IsSuccess: true,
          ErrorMessage: null,
        });

        const actualProducts = response.body.Products;
        expectArraySorted(actualProducts, compareByCreatedOnDesc);

        const { limit, search, manufacturer, total, page: pageParam, sorting } = response.body;
        expect.soft(limit, `Limit should be ${limit}`).toBe(10);
        expect.soft(search).toBe("");
        expect.soft(manufacturer).toEqual([]);
        expect.soft(pageParam).toBe(1);
        expect.soft(sorting).toEqual({ sortField: "createdOn", sortOrder: "desc" });
        expect.soft(total).toBeGreaterThanOrEqual(2);
      },
    );

    test(
      "SC-011: Сортировка по manufacturer (desc)",
      { tag: [TAGS.REGRESSION, TAGS.API, TAGS.PRODUCTS] },
      async ({ productsApiService, productsApi, page }) => {
        const product1 = await productsApiService.create(token);
        await page.waitForTimeout(1000);
        const product2 = await productsApiService.create(token);

        ids.push(product1._id, product2._id);
        const response = await productsApi.getSorted(token, { sortField: "manufacturer", sortOrder: "desc" });

        validateResponse(response, {
          status: STATUS_CODES.OK,
          IsSuccess: true,
          ErrorMessage: null,
        });

        const actualProducts = response.body.Products;
        expectArraySorted(actualProducts, compareByManufacturerDesc);

        const { limit, search, manufacturer, total, page: pageParam, sorting } = response.body;
        expect.soft(limit, `Limit should be ${limit}`).toBe(10);
        expect.soft(search).toBe("");
        expect.soft(manufacturer).toEqual([]);
        expect.soft(pageParam).toBe(1);
        expect.soft(sorting).toEqual({ sortField: "manufacturer", sortOrder: "desc" });
        expect.soft(total).toBeGreaterThanOrEqual(2);
      },
    );
  });
});
