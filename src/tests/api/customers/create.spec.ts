import { test } from "fixtures";
import {
  createCustomerData_positiveCases,
  createCustomerData_negativeCases,
  createCustomerData_duplicateCases,
} from "data/customers/createCustomer.ddt";
import { validateResponse } from "utils/validation/validateResponse.utils";
import { COMPONENT_TAG, TEST_TAG } from "data/types/tags.types";

test.describe("[API] [Sales Portal] [Customer Create]", () => {
  let id = "";
  let token = "";

  test.beforeEach(async ({ loginApiService }) => {
    token = await loginApiService.loginAsAdmin();
  });

  test.describe("Create customer with valid request body", () => {
    for (const caseData of createCustomerData_positiveCases) {
      test(
        `${caseData.title}`,
        { tag: [TEST_TAG.REGRESSION, TEST_TAG.SMOKE, TEST_TAG.POSITIVE, COMPONENT_TAG.CUSTOMERS] },
        async ({ customerApi }) => {
          const response = await customerApi.create(caseData.customerData, token);
          id = response.body.Customer._id;

          validateResponse(response, {
            status: caseData.expectedStatus!,
            IsSuccess: caseData.expectedIsSuccess!,
            schema: caseData.expectedSchema!,
          });
        },
      );
    }
  });

  test.describe("Create customer with invalid request body", () => {
    for (const caseData of createCustomerData_negativeCases) {
      test(
        `${caseData.title}`,
        { tag: [TEST_TAG.REGRESSION, TEST_TAG.NEGATIVE, COMPONENT_TAG.CUSTOMERS] },
        async ({ customerApi }) => {
          const response = await customerApi.create(caseData.customerData, token);

          validateResponse(response, {
            status: caseData.expectedStatus!,
            IsSuccess: caseData.expectedIsSuccess!,
            schema: caseData.expectedSchema!,
          });
        },
      );
    }
  });

  test.describe("Create customer with duplicate email", () => {
    for (const caseData of createCustomerData_duplicateCases) {
      test(
        `${caseData.title}`,
        { tag: [TEST_TAG.REGRESSION, COMPONENT_TAG.CUSTOMERS] },
        async ({ customerApi, customerApiService }) => {
          const customer = await customerApiService.create(token, caseData.customerData);
          id = customer._id;

          const response = await customerApi.create(caseData.customerData, token);

          validateResponse(response, {
            status: caseData.expectedStatus!,
            IsSuccess: caseData.expectedIsSuccess!,
            schema: caseData.expectedSchema,
            ErrorMessage: caseData.expectedErrorMessage!,
          });
        },
      );
    }
  });

  test.afterEach(async ({ customerApiService }) => {
    if (id) {
      await customerApiService.delete(token, id);
      id = "";
    }
  });
});
