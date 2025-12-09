import { test } from "fixtures";
import {
  createCustomerData_positiveCases,
  createCustomerData_negativeCases,
  createCustomerData_duplicateCases,
} from "data/customers/createCustomer.ddt";
import { validateResponse } from "utils/validation/validateResponse.utils";

test.describe("[API] [Sales Portal] [Customer Create]", () => {
  let id = "";
  let token = "";

  test.beforeEach(async ({ loginApiService }) => {
    token = await loginApiService.loginAsAdmin();
  });

  test.describe("Создание клиента с валидным телом запроса", () => {
    test.afterEach(async ({ customerApiService }) => {
      await customerApiService.delete(token, id);
    });

    for (const caseData of createCustomerData_positiveCases) {
      test(`${caseData.title}`, async ({ customerApi }) => {
        const response = await customerApi.create(caseData.customerData, token);
        id = response.body.Customer._id;

        validateResponse(response, {
          status: caseData.expectedStatus!,
          IsSuccess: caseData.expectedIsSuccess!,
          schema: caseData.expectedSchema!,
        });
      });
    }
  });

  test.describe("Создание клиента с невалидным телом запроса", () => {
    for (const caseData of createCustomerData_negativeCases) {
      test(`${caseData.title}`, async ({ customerApi }) => {
        const response = await customerApi.create(caseData.customerData, token);

        validateResponse(response, {
          status: caseData.expectedStatus!,
          IsSuccess: caseData.expectedIsSuccess!,
          schema: caseData.expectedSchema!,
        });
      });
    }
  });

  test.describe("Создание клиента с дублирующимся email", () => {
    for (const caseData of createCustomerData_duplicateCases) {
      test(`${caseData.title}`, async ({ customerApi, customerApiService }) => {
        const customer = await customerApiService.create(token, caseData.customerData);
        id = customer._id;

        const response = await customerApi.create(caseData.customerData, token);

        validateResponse(response, {
          status: caseData.expectedStatus!,
          IsSuccess: caseData.expectedIsSuccess!,
          schema: caseData.expectedSchema,
          ErrorMessage: caseData.expectedErrorMessage!,
        });
      });
    }
  });
});
