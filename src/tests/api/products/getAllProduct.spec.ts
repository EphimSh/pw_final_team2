import { test, expect } from "fixtures/api.fixtures";
import { STATUS_CODES } from "data/statusCode";
import { validateResponse } from "utils/validation/validateResponse.utils";
import { getAllProductsSchema } from "data/schemas/products/getAll.schema";
import { MANUFACTURERS } from "data/types/manufacturers";
import { productsForCreation } from "data/products/productsForCreation";

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

  test("SC-007: Получение товаров без параметров", async ({ productsApi }) => {
    const getProductResponse = await productsApi.getAll(token);

    validateResponse(getProductResponse, {
      status: STATUS_CODES.OK,
      schema: getAllProductsSchema,
      IsSuccess: true,
      ErrorMessage: null,
    });
  });

  test("SC-008: Фильтр по одному производителю", async ({ productsApi }) => {
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
  });

  test("SC-009: Фильтр по нескольким производителям", async ({ productsApi }) => {
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
  });

  test("SC-010: Поиск по названию товара", async ({ productsApi }) => {
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
  });

  test("SC-011: Сортировка по цене по возрастанию", async ({ productsApi }) => {
    const getProductResponse = await productsApi.getSorted(token, {
      sortField: "price",
      sortOrder: "asc",
    });

    validateResponse(getProductResponse, {
      status: STATUS_CODES.OK,
      schema: getAllProductsSchema,
      IsSuccess: true,
      ErrorMessage: null,
    });

    const sortedResponse = [...getProductResponse.body.Products.sort((a, b) => b.price - a.price)];
    expect(getProductResponse.body.Products, "Products should be sorted by price in ASC order").toEqual(sortedResponse);
  });

  test("SC-012: Сортировка по дате создания (новые сначала)", async ({ productsApi }) => {
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

    const sortedResponse = [
      ...getProductResponse.body.Products.sort(
        (a, b) => new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime(),
      ),
    ];
    expect(getProductResponse.body.Products, "Products should be sorted by createdOn in DESC order").toEqual(
      sortedResponse,
    );
  });
});
