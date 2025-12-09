import { getCustomerByIdData_negativeCases, getCustomerByIdData_positiveCases } from "data/customers/getById.ddt";
import { test } from "fixtures";
import { validateResponse } from "utils/validation/validateResponse.utils";

test.describe("[API] [Sales Portal] [Get customer]", () => {
  let token = "";
  let id = "";

  test.describe("Получение клиента с валидным ID", () => {
    test.beforeEach(async ({ loginApiService }) => {
      token = await loginApiService.loginAsAdmin();
    });

    for (const caseData of getCustomerByIdData_positiveCases) {
      test(`${caseData.title}`, async ({ customerApiService, customerApi }) => {
        const customer = await customerApiService.create(token, caseData.customerData!);
        id = customer._id;
        const response = await customerApi.getById(id, token);

        validateResponse(response, {
          status: caseData.expectedStatus!,
          IsSuccess: caseData.expectedIsSuccess!,
          schema: caseData.expectedSchema!,
        });
      });
    }

    test.afterEach(async ({ customerApiService }) => {
      await customerApiService.delete(token, id);
    });
  });

  test.describe("Получение клиента с невалидным ID", () => {
    test.beforeEach(async ({ loginApiService }) => {
      token = await loginApiService.loginAsAdmin();
    });
    for (const caseData of getCustomerByIdData_negativeCases) {
      test(`${caseData.title}`, async ({ customerApi }) => {
        const response = await customerApi.getById(caseData.id!, token);
        validateResponse(response, {
          status: caseData.expectedStatus!,
          IsSuccess: caseData.expectedIsSuccess!,
          schema: caseData.expectedSchema!,
        });
      });
    }
  });
});
