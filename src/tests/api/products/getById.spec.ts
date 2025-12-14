import { test, expect } from "fixtures/api.fixtures";
import { getProductSchema } from "data/schemas/products/get.schema";

import { validateResponse } from "utils/validation/validateResponse.utils";
import { TAGS } from "data/tags/tags";
import { STATUS_CODES } from "data/statusCode";

test.describe("[API] [Sales Portal] [Products]", () => {
  let id = "";
  let token = "";

  test.afterEach(async ({ productsApiService }) => {
    await productsApiService.delete(token, id);
  });

  test(
    "SC-015: Успешное получение товара по валидному ID",
    { tag: [TAGS.SMOKE, TAGS.REGRESSION, TAGS.API, TAGS.PRODUCTS] },
    async ({ loginApiService, productsApiService, productsApi }) => {
      token = await loginApiService.loginAsAdmin();
      const product = await productsApiService.create(token);
      id = product._id;

      const getProductResponse = await productsApi.getById(id, token);
      validateResponse(getProductResponse, {
        status: STATUS_CODES.OK,
        schema: getProductSchema,
        IsSuccess: true,
        ErrorMessage: null,
      });
      expect(getProductResponse.body.Product).toEqual(product);
    },
  );
});
