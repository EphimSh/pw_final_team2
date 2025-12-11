import { test, expect } from "fixtures/api.fixtures";
import { STATUS_CODES } from "data/statusCode";
import { ObjectId } from "bson";
import { validateResponse } from "utils/validation/validateResponse.utils";
import { errorSchema } from "data/schemas/core.schema";

test.describe("[API] [Sales Portal] [Products] [Delete]", () => {
  let id = "";
  let token = "";

  test.beforeAll(async ({ loginApiService }) => {
    token = await loginApiService.loginAsAdmin();
  });

  test("SC-023: Успешное удаление товара", async ({ productsApiService, productsApi }) => {
    const createdProduct = await productsApiService.create(token);
    id = createdProduct._id;
    const response = await productsApi.delete(id, token);

    expect(response.status).toBe(STATUS_CODES.DELETED);
    expect(response.body).toBe("");

    const getResponse = await productsApi.getById(id, token);
    expect(getResponse.status).toBe(STATUS_CODES.NOT_FOUND);
    validateResponse(getResponse, {
      status: STATUS_CODES.NOT_FOUND,
      IsSuccess: false,
      ErrorMessage: `Product with id '${id}' wasn't found`,
    });
  });

  test("SC-024: Повторное удаление того же товара", async ({ productsApi }) => {
    const response = await productsApi.delete(id, token);
    expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
  });

  // TODO: Сделать проверку после написания orders, т к надо вызвать их апишку и добавить этот продукт в заказ

  // test("SC-025: Удаление товара с привязанными заказами", async ({ loginApiService, productsApiService, productsApi }) => {
  //     const token = await loginApiService.loginAsAdmin();
  //     const createdProduct = await productsApiService.create(token);
  //     const id = createdProduct._id;
  //     const response = await productsApi.delete(id, token);
  //     expect(response.status).toBe(STATUS_CODES.CONFLICT);
  // });

  test("SC-026: Удаление с невалидным ID", async ({ productsApi }) => {
    id = new ObjectId().toHexString();
    const response = await productsApi.delete(id, token);

    validateResponse(response, {
      status: STATUS_CODES.NOT_FOUND,
      schema: errorSchema,
      IsSuccess: false,
      ErrorMessage: `Product with id '${id}' wasn't found`,
    });
  });
});
