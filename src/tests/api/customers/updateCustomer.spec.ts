import {
  updateCustomer_conflictCases,
  updateCustomer_negativeCases,
  updateCustomer_notFoundCases,
  updateCustomer_positiveCases,
} from "data/customers/updateCustomer.ddt";
import { TEST_TAG, COMPONENT_TAG } from "data/types/tags.types";
import { test } from "fixtures";
import { validateResponse } from "utils/validation/validateResponse.utils";

test.describe("[API] [Sales Portal] [Update customer]", () => {
  const ids: string[] = [];
  let token = "";

  test.beforeEach(async ({ loginApiService }) => {
    token = await loginApiService.loginAsAdmin();
  });

  for (const caseData of updateCustomer_positiveCases) {
    test(
      `${caseData.title}`,
      { tag: [TEST_TAG.REGRESSION, TEST_TAG.POSITIVE, COMPONENT_TAG.CUSTOMERS] },
      async ({ customerApiService, customerApi }) => {
        const customer = await customerApiService.create(token, caseData.customerData);
        ids.push(customer._id);

        const resposne = await customerApi.update(customer._id, caseData.updatedCustomerData!, token);

        validateResponse(resposne, {
          status: caseData.expectedStatus!,
          schema: caseData.expectedSchema!,
          IsSuccess: caseData.expectedIsSuccess!,
        });

        customerApiService.assertCustomerUpdated(customer, resposne);
      },
    );
  }

  for (const caseData of updateCustomer_negativeCases) {
    test(
      `${caseData.title}`,
      { tag: [TEST_TAG.REGRESSION, TEST_TAG.SMOKE, TEST_TAG.NEGATIVE, COMPONENT_TAG.CUSTOMERS] },
      async ({ customerApiService, customerApi }) => {
        const customer = await customerApiService.create(token, caseData.customerData);
        ids.push(customer._id);

        const resposne = await customerApi.update(caseData.id!, caseData.updatedCustomerData!, token);

        validateResponse(resposne, {
          status: caseData.expectedStatus!,
          schema: caseData.expectedSchema!,
          IsSuccess: caseData.expectedIsSuccess!,
          ErrorMessage: caseData.expectedErrorMessage!,
        });
      },
    );
  }

  for (const caseData of updateCustomer_notFoundCases) {
    test(
      `${caseData.title}`,
      { tag: [TEST_TAG.REGRESSION, TEST_TAG.SMOKE, COMPONENT_TAG.CUSTOMERS, COMPONENT_TAG.NOTIFICATIONS] },
      async ({ customerApi }) => {
        const response = await customerApi.update(caseData.id!, caseData.updatedCustomerData!, token);

        validateResponse(response, {
          status: caseData.expectedStatus!,
          schema: caseData.expectedSchema!,
          IsSuccess: caseData.expectedIsSuccess!,
          ErrorMessage: caseData.expectedErrorMessage!,
        });
      },
    );
  }

  for (const caseData of updateCustomer_conflictCases) {
    test(
      `${caseData.title}`,
      { tag: [TEST_TAG.NEGATIVE, COMPONENT_TAG.CUSTOMERS] },
      async ({ customerApiService, customerApi }) => {
        const existsCustomer = await customerApiService.create(token, caseData.additionalData!);
        const customerToUpdate = await customerApiService.create(token, caseData.customerData!);
        ids.push(existsCustomer._id, customerToUpdate._id);

        const response = await customerApi.update(customerToUpdate._id, caseData.updatedCustomerData!, token);

        validateResponse(response, {
          status: caseData.expectedStatus!,
          schema: caseData.expectedSchema!,
          IsSuccess: caseData.expectedIsSuccess!,
          ErrorMessage: caseData.expectedErrorMessage!,
        });
      },
    );
  }

  test.afterEach(async ({ customerApiService }) => {
    if (ids.length) await customerApiService.deleteAllCustomers(ids, token);
  });
});
