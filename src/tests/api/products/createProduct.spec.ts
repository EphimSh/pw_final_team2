import { test, expect } from "fixtures/api.fixtures";
import { generateProductData } from "data/products/generateProductData";
import { createProductSchema } from "data/schemas/products/create.schema";
import { STATUS_CODES } from "data/statusCode";
import _ from "lodash";
import { validateResponse } from "utils/validation/validateResponse.utils";
import { IProduct } from "data/types/products.types";
import { errorSchema } from "data/schemas/core.schema";

test.describe("[API] [Sales Portal] [Products] [Create]", () => {
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

  test("SC-001: Успешное создание товара со всеми полями", async ({ productsApi }) => {
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

  test("SC-002: Создание товара без опционального поля notes", async ({ productsApi }) => {
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
  });

  test("SC-003: Отсутствует обязательное поле name", async ({ productsApi }) => {
    productData.name = undefined;
    const createdProduct = await productsApi.create(productData, token);
    validateResponse(createdProduct, {
      status: STATUS_CODES.BAD_REQUEST,
      schema: errorSchema,
      IsSuccess: false,
      ErrorMessage: "Incorrect request body",
    });
  });

  test("SC-004: Невалидный manufacturer (не из списка enum)", async ({ productsApi }) => {
    productData.manufacturer = "Huawei";
    const createdProduct = await productsApi.create(productData, token);
    validateResponse(createdProduct, {
      status: STATUS_CODES.BAD_REQUEST,
      schema: errorSchema,
      IsSuccess: false,
      ErrorMessage: "Incorrect request body",
    });
  });

  test("SC-005: Отрицательные числа в amount и price", async ({ productsApi }) => {
    productData.price = -10;
    productData.amount = -100;
    const createdProduct = await productsApi.create(productData, token);
    validateResponse(createdProduct, {
      status: STATUS_CODES.BAD_REQUEST,
      schema: errorSchema,
      IsSuccess: false,
      ErrorMessage: "Incorrect request body",
    });
  });

  test("SC-006: Неправильный Content-Type", async ({ productsApi }) => {
    const createdProduct = await productsApi.create(productData, token, "text/plain");
    validateResponse(createdProduct, {
      status: STATUS_CODES.BAD_REQUEST,
      schema: errorSchema,
      IsSuccess: false,
      ErrorMessage: "Incorrect request body",
    });
  });
});
