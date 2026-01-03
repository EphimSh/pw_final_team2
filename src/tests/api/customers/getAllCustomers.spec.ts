import { faker } from "@faker-js/faker";
import { getAllCustomersSchema } from "data/schemas/customers/getAll.schema";
import { STATUS_CODES } from "data/statusCode";
import { ICustomerFromResponse } from "data/types/customers.types";
import { TEST_TAG, COMPONENT_TAG } from "data/types/tags.types";
import { test } from "fixtures/api.fixtures";
import { validateResponse } from "utils/validation/validateResponse.utils";

test.describe("[API] [Sales Portal] [Customers] [GetAll]", async () => {
  let id = "";
  let token = "";
  let createdCustomer: ICustomerFromResponse;

  test.beforeAll(async ({ loginApiService, customerApiService }) => {
    token = await loginApiService.loginAsAdmin();
    createdCustomer = await customerApiService.create(token);
    id = createdCustomer._id;
  });

  test.afterEach(async ({ customerApiService }) => {
    if (id) await customerApiService.delete(token, id);
  });

  test(
    "Get All Customers via API",
    { tag: [TEST_TAG.REGRESSION, TEST_TAG.POSITIVE, COMPONENT_TAG.CUSTOMERS] },
    async ({ customerApi }) => {
      const getAllCustomersResponse = await customerApi.getAll(token);
      validateResponse(getAllCustomersResponse, {
        status: STATUS_CODES.OK,
        schema: getAllCustomersSchema,
        IsSuccess: true,
        ErrorMessage: null,
      });
    },
  );

  test(
    "Get All Customers without Token via API",
    { tag: [TEST_TAG.REGRESSION, TEST_TAG.NEGATIVE, COMPONENT_TAG.CUSTOMERS] },
    async ({ customerApi }) => {
      const getAllCustomersResponse = await customerApi.getAll("");
      validateResponse(getAllCustomersResponse, {
        status: STATUS_CODES.UNAUTHORIZED,
        IsSuccess: false,
        ErrorMessage: "Not authorized",
      });
    },
  );

  test(
    "Get All Customers with incorrect Token via API",
    { tag: [TEST_TAG.REGRESSION, TEST_TAG.NEGATIVE, COMPONENT_TAG.CUSTOMERS] },
    async ({ customerApi }) => {
      const invalidToken = faker.string.alphanumeric({ length: { min: 1, max: 200 } });

      const getAllCustomersResponse = await customerApi.getAll(invalidToken);
      validateResponse(getAllCustomersResponse, {
        status: STATUS_CODES.UNAUTHORIZED,
        IsSuccess: false,
        ErrorMessage: "Invalid access token",
      });
    },
  );
});
