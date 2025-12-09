import { test, expect } from "fixtures/api.fixtures";
import { getAllProductsSchema } from "data/schemas/products/getAll.schema";

import { validateResponse } from "utils/validation/validateResponse.utils";
import { TAGS } from "data/tags/tags";
import { STATUS_CODES } from "data/statusCode";

test.describe("[API] [Sales Portal]", () => {
  // TODO: добавить тесты для:
  // - Фильтр по одному производителю
  // - Фильтр по нескольким производителям
  // - Поиск по названию
  // - Сортировка по цене по возрастанию
  // - Сортировка по дате создания (desc)
  // - Невалидный параметр сортировки
  // - Невалидный порядок сортировки
  const id = "";
  const token = "";

  test.afterEach(async ({ productsApiService }) => {
    if (id) await productsApiService.delete(token, id);
  });

  test(
    "SC-007: Получение товаров без параметров",
    { tag: [TAGS.SMOKE, TAGS.REGRESSION, TAGS.API, TAGS.PRODUCTS] },
    async ({ loginApiService, productsApiService, productsApi }) => {
      const token = await loginApiService.loginAsAdmin();
      const createdProduct = await productsApiService.create(token);
      const id = createdProduct._id;

      const getAllProductsResponse = await productsApi.getAll(token);

      const getAllProductsBody = getAllProductsResponse.body;
      await validateResponse(getAllProductsResponse, {
        status: STATUS_CODES.OK,
        schema: getAllProductsSchema,
        IsSuccess: true,
        ErrorMessage: null,
      });
      const product = getAllProductsBody["Products"].find((prod: { _id: string }) => prod._id === id);
      expect(product).toEqual(createdProduct);
    },
  );
});
