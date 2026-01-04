import { generateCommentText } from "data/orders/generateCommentText";
import { COMPONENT_TAG, TEST_TAG } from "data/types/tags.types";
import { test } from "fixtures";

test.describe("[UI] [Sales Portal] [Orders] [Order Details]", () => {
  let token = "";
  let orderId = "";

  test.beforeAll(async ({ loginApiService, ordersApiService }) => {
    token = await loginApiService.loginAsAdmin();
    const order = await ordersApiService.createDraftOrder(token);
    orderId = order._id;
  });

  test.afterAll(async ({ ordersApiService }) => {
    if (orderId) await ordersApiService.deleteOrderWithCustomerAndProduct(orderId, token);
  });

  test(
    "Add comment to Order",
    { tag: [TEST_TAG.REGRESSION, TEST_TAG.UI, TEST_TAG.POSITIVE, COMPONENT_TAG.ORDERS, COMPONENT_TAG.COMMENT] },
    async ({ orderUIService, loginUIService }) => {
      const comment = generateCommentText();
      await loginUIService.loginAsAdmin();
      await orderUIService.openOrderById(orderId);
      await orderUIService.addComment(comment);
    },
  );

  test(
    "Remove comment from Order",
    { tag: [TEST_TAG.REGRESSION, TEST_TAG.UI, TEST_TAG.POSITIVE, COMPONENT_TAG.ORDERS, COMPONENT_TAG.COMMENT] },
    async ({ orderUIService, loginUIService }) => {
      const comment = generateCommentText();
      await loginUIService.loginAsAdmin();
      await orderUIService.openOrderById(orderId);
      await orderUIService.removeComment(comment);
    },
  );
});
