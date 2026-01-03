import { searchTestCases } from "data/products/searchTestData.ddt";
import { sortProductListTestCases } from "data/products/sortProductListTestData.ddt";
import { expectArraySorted } from "data/products/sort.helper";
import { STATUS_CODES } from "data/statusCode";
import { TAGS } from "data/tags/tags";
import { IProductFromResponse } from "data/types/products.types";
import { test } from "fixtures";

import { validateResponse } from "utils/validation/validateResponse.utils";
import { COMPONENT_TAG } from "data/types/tags.types";

test.describe("[API] [Sales Portal] [Products] Get Sorted", () => {
  test.describe("Search", () => {
    let id = "";
    let token = "";
    let product: IProductFromResponse;

    test.beforeEach(async ({ loginApiService, productsApiService }) => {
      token = await loginApiService.loginAsAdmin();
      product = await productsApiService.create(token);
      id = product._id;
    });
    test.afterEach(async ({ productsApiService }) => {
      if (id) await productsApiService.delete(token, id);
      id = "";
    });

    for (const caseData of searchTestCases) {
      test(
        `${caseData.title}`,
        { tag: [TAGS.REGRESSION, TAGS.API, COMPONENT_TAG.PRODUCTS] },
        async ({ productsApiService, productsApi }) => {
          const searchValue = caseData.getSearchValue(product);
          const response = await productsApi.getSorted(token, { search: searchValue });

          validateResponse(response, {
            status: caseData.expectedStatus,
            IsSuccess: caseData.expectedIsSuccess,
            ErrorMessage: caseData.expectedErrorMessage,
            schema: caseData.expectedSchema!,
          });

          await productsApiService.assertProductInSortedList(
            response,
            product,
            caseData.sortField,
            caseData.sortOrder,
            searchValue,
          );
        },
      );
    }
  });

  test.describe("Sorting", () => {
    const ids: string[] = [];
    let token = "";
    let createdProducts: IProductFromResponse[] = [];

    test.beforeEach(async ({ loginApiService, productsApiService, page }) => {
      token = await loginApiService.loginAsAdmin();
      createdProducts = [];
      const product1 = await productsApiService.create(token);
      await page.waitForTimeout(1000);
      const product2 = await productsApiService.create(token);
      createdProducts.push(product1, product2);
      ids.push(product1._id, product2._id);
    });
    test.afterEach(async ({ productsApiService }) => {
      if (ids.length) {
        for (const id of ids) {
          await productsApiService.delete(token, id);
        }
        ids.length = 0;
      }
    });

    for (const caseData of sortProductListTestCases) {
      test(
        caseData.title,
        { tag: [TAGS.REGRESSION, TAGS.API, COMPONENT_TAG.PRODUCTS] },
        async ({ productsApi, productsApiService }) => {
          const response = await productsApi.getSorted(token, {
            sortField: caseData.sortField,
            sortOrder: caseData.sortOrder,
            limit: caseData.expectedLimit,
          });

          validateResponse(response, {
            status: caseData.expectedStatus ?? STATUS_CODES.OK,
            IsSuccess: caseData.expectedIsSuccess,
            ErrorMessage: caseData.expectedErrorMessage,
            schema: caseData.expectedSchema!,
          });

          const actualProducts = response.body.Products;
          expectArraySorted(actualProducts, caseData.compareFn);
          await productsApiService.assertSortedResponseMeta(
            response,
            caseData.sortField,
            caseData.sortOrder,
            caseData.expectedLimit,
            createdProducts.length,
          );
        },
      );
    }
  });
});
