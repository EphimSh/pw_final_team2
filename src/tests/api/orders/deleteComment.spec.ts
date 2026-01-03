import { generateID } from "data/generateID";
import { ERROR_MESSAGES } from "data/notifications/notifications";
import { generateCommentText } from "data/orders/generateCommentText";
import { STATUS_CODES } from "data/statusCode";
import { TEST_TAG, COMPONENT_TAG } from "data/types/tags.types";
import { test } from "fixtures/api.fixtures";
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
    await ordersApiService.deleteOrderWithCustomerAndProduct(orderID, token);
  });

  test(
    "Delete comment from Order",
    {
      tag: [
        TEST_TAG.REGRESSION,
        TEST_TAG.SMOKE,
        TEST_TAG.API,
        TEST_TAG.POSITIVE,
        COMPONENT_TAG.ORDERS,
        COMPONENT_TAG.COMMENT,
      ],
    },
    async ({ ordersApi, ordersApiService }) => {
      const comment = generateCommentText();
      await ordersApiService.addOrderComment(orderID, token, comment);
      const commentID = await ordersApiService.getCommentIDByText(orderID, comment, token);

      const deleteCommentResponse = await ordersApi.deleteComment(orderID, commentID!, token);
      validateResponse(deleteCommentResponse, {
        status: STATUS_CODES.DELETED,
      });

      await ordersApiService.assertCommentIsDeleted(orderID, commentID!, token);
    },
  );

  test(
    "Delete multiple comments from Order",
    {
      tag: [TEST_TAG.REGRESSION, TEST_TAG.API, TEST_TAG.POSITIVE, COMPONENT_TAG.ORDERS, COMPONENT_TAG.COMMENT],
    },
    async ({ ordersApi, ordersApiService }) => {
      const comments = [generateCommentText(), generateCommentText(), generateCommentText()];

      const commentIDs: string[] = [];
      for (const comment of comments) {
        await ordersApiService.addOrderComment(orderID, token, comment);
        const commentID = await ordersApiService.getCommentIDByText(orderID, comment, token);
        commentIDs.push(commentID!);
      }

      for (const commentID of commentIDs) {
        const deleteCommentResponse = await ordersApi.deleteComment(orderID, commentID, token);
        validateResponse(deleteCommentResponse, {
          status: STATUS_CODES.DELETED,
        });
      }

      for (const commentID of commentIDs) {
        await ordersApiService.assertCommentIsDeleted(orderID, commentID, token);
      }
    },
  );

  test(
    "Delete non-existing comment from Order",
    {
      tag: [TEST_TAG.REGRESSION, TEST_TAG.API, TEST_TAG.NEGATIVE, COMPONENT_TAG.ORDERS, COMPONENT_TAG.COMMENT],
    },
    async ({ ordersApi }) => {
      const fakeCommentID = generateID();
      const deleteCommentResponse = await ordersApi.deleteComment(orderID, fakeCommentID, token);
      validateResponse(deleteCommentResponse, {
        status: STATUS_CODES.BAD_REQUEST,
        IsSuccess: false,
        ErrorMessage: ERROR_MESSAGES.COMMENT_NOT_FOUND,
      });
    },
  );

  test(
    "Delete comment with invalid Order ID ",
    {
      tag: [TEST_TAG.REGRESSION, TEST_TAG.API, TEST_TAG.NEGATIVE, COMPONENT_TAG.ORDERS, COMPONENT_TAG.COMMENT],
    },
    async ({ ordersApi }) => {
      const invalidOrderID = generateID();
      const invalidCommentID = generateID();
      const deleteCommentResponse = await ordersApi.deleteComment(invalidOrderID, invalidCommentID, token);
      validateResponse(deleteCommentResponse, {
        status: STATUS_CODES.NOT_FOUND,
        IsSuccess: false,
      });
    },
  );
});
