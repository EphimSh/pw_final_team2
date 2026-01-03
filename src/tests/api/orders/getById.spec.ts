import { getOrderByIdData_negativeCases } from "data/orders/getByIdData.ddt";
import { createOrderSchema } from "data/schemas/orders/create.schema";
import { STATUS_CODES } from "data/statusCode";
import { test } from "fixtures/api.fixtures";

import { validateResponse } from "utils/validation/validateResponse.utils";

test.describe("[API] [Sales Portal] [Orders] [Get by Id]", () => {
  let token = "";
  let orderID = "";

  test.beforeAll(async ({ loginApiService }) => {
    token = await loginApiService.loginAsAdmin();
  });

  for (const testData of getOrderByIdData_negativeCases) {
    test(`${testData.title}`, async ({ ordersApi }) => {
      const response = await ordersApi.getByID(testData.id!, token);
      validateResponse(response, {
        status: testData.expectedStatus!,
        schema: testData.expectedSchema!,
        IsSuccess: testData.expectedIsSuccess!,
      });
    });
  }

  test("SC-074: Successful order retrieval", async ({ ordersApiService, ordersApi }) => {
    const testOrder = await ordersApiService.createDraftOrderWithDelivery(token);
    orderID = testOrder._id;
    const response = await ordersApi.getByID(testOrder._id, token);
    validateResponse(response, {
      status: STATUS_CODES.OK,
      schema: createOrderSchema,
      IsSuccess: true,
    });
  });

  test("SC-077: Check related data loading", async ({ ordersApiService, ordersApi }) => {
    const testOrder = await ordersApiService.createDraftOrderWithDelivery(token);
    orderID = testOrder._id;
    await ordersApiService.addOrderComment(orderID, token, "Test comment");
    const response = await ordersApi.getByID(testOrder._id, token);
    validateResponse(response, {
      status: STATUS_CODES.OK,
      schema: createOrderSchema,
      IsSuccess: true,
    });
    await ordersApiService.assertOrderRelatedDataLoaded(response, "Test comment");
  });

  test.afterEach(async ({ ordersApiService }) => {
    if (orderID) {
      await ordersApiService.deleteOrder(orderID, token);
      orderID = "";
    }
  });
});
