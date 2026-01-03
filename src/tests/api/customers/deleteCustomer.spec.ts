import { generateCustomerID } from "data/customers/generateCustomerData";
import { STATUS_CODES } from "data/statusCode";
import { TEST_TAG, COMPONENT_TAG } from "data/types/tags.types";
import { expect, test } from "fixtures/api.fixtures";
import { validateResponse } from "utils/validation/validateResponse.utils";

test.describe("[API] [Sales Portal] [Customers] [Delete]", async () => {
  let id = "";
  let token = "";

  test.beforeAll(async ({ loginApiService }) => {
    token = await loginApiService.loginAsAdmin();
  });

  test(
    "Delete Customer by ID via API",
    { tag: [TEST_TAG.REGRESSION, TEST_TAG.SMOKE, TEST_TAG.POSITIVE, COMPONENT_TAG.CUSTOMERS] },
    async ({ customerApiService, customerApi }) => {
      const createdCustomer = await customerApiService.create(token);
      id = createdCustomer._id;

      const deleteResponse = await customerApi.delete(id, token);
      expect(deleteResponse.status).toBe(STATUS_CODES.DELETED);
      expect(deleteResponse.body).toBe("");

      const getCustomerResponse = await customerApi.getById(id, token);
      validateResponse(getCustomerResponse, {
        status: STATUS_CODES.NOT_FOUND,
        IsSuccess: false,
        ErrorMessage: `Customer with id '${id}' wasn't found`,
      });
    },
  );

  test(
    "Delete Customer by ID for the second time via API",
    { tag: [TEST_TAG.REGRESSION, TEST_TAG.NEGATIVE, COMPONENT_TAG.CUSTOMERS] },
    async ({ customerApiService, customerApi }) => {
      const createdCustomer = await customerApiService.create(token);
      id = createdCustomer._id;

      const deleteResponse = await customerApi.delete(id, token);
      expect(deleteResponse.status).toBe(STATUS_CODES.DELETED);

      const repeatedDeleteResponse = await customerApi.delete(id, token);
      validateResponse(repeatedDeleteResponse, {
        status: STATUS_CODES.NOT_FOUND,
        IsSuccess: false,
        ErrorMessage: `Customer with id '${id}' wasn't found`,
      });
    },
  );

  test(
    "Delete Customer with invalid ID via API",
    { tag: [TEST_TAG.REGRESSION, TEST_TAG.NEGATIVE, COMPONENT_TAG.CUSTOMERS] },
    async ({ customerApi }) => {
      const invalidID = generateCustomerID();

      const deleteResponse = await customerApi.delete(invalidID, token);
      validateResponse(deleteResponse, {
        status: STATUS_CODES.NOT_FOUND,
        IsSuccess: false,
        ErrorMessage: `Customer with id '${invalidID}' wasn't found`,
      });
    },
  );
});
