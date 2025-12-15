import { ERROR_MESSAGES } from "data/notifications/notifications";
import { STATUS_CODES } from "data/statusCode";
import { expect, test } from "fixtures/api.fixtures";
import { validateResponse } from "utils/validation/validateResponse.utils";

test.describe("[API] [Sales Portal] [Orders] [Add Comment]", () => {
  let token = "";
  let orderID = "";

  test.beforeEach(async ({ loginApiService, ordersApiService }) => {
    token = await loginApiService.loginAsAdmin();
    const order = await ordersApiService.createDraftOrder(token);
    orderID = order._id;
  });

  test.afterEach(async ({ ordersApiService }) => {
    await ordersApiService.deleteOrder(orderID, token);
  });

  // transform to ddt
  test("Add valid comment to Order", async ({ ordersApi, ordersApiService }) => {
    const comment = ordersApiService.generateCommentText();
    const response = await ordersApi.addComment(orderID, comment, token);
    validateResponse(response, {
      status: STATUS_CODES.OK,
      IsSuccess: true,
      ErrorMessage: null,
    });

    const orderComments = response.body.Order.comments!;
    expect(orderComments.find((c: { text: string }) => c.text === comment)).toBeTruthy();
  });

  test("Add empty comment to Order", async ({ ordersApi, ordersApiService }) => {
    const comment = ordersApiService.generateCommentText(0);
    const response = await ordersApi.addComment(orderID, comment, token);
    validateResponse(response, {
      status: STATUS_CODES.BAD_REQUEST,
      IsSuccess: false,
      ErrorMessage: ERROR_MESSAGES.BAD_REQUEST,
    });
  });

  test("Add very long comment to Order", async ({ ordersApi, ordersApiService }) => {
    const comment = ordersApiService.generateCommentText(251);
    const response = await ordersApi.addComment(orderID, comment, token);
    validateResponse(response, {
      status: STATUS_CODES.BAD_REQUEST,
      IsSuccess: false,
      ErrorMessage: ERROR_MESSAGES.BAD_REQUEST,
    });
  });
});
