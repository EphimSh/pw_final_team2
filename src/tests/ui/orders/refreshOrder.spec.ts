import { COMPONENT_TAG, TEST_TAG } from "data/types/tags.types";
import { test } from "fixtures";

test.describe("[UI] [Sales Portal] [Orders] [Order Details]", () => {
  let token = "";
  let orderId = "";
  let customerId = "";

  test.beforeAll(async ({ loginApiService, ordersApiService }) => {
    token = await loginApiService.loginAsAdmin();
    const order = await ordersApiService.createDraftOrder(token, 1);
    orderId = order._id;
    customerId = order.customer._id;
  });

  test.afterAll(async ({ ordersApiService }) => {
    if (orderId) await ordersApiService.deleteOrderWithCustomerAndProduct(orderId, token);
  });

  test(
    "Refresh Order",
    { tag: [TEST_TAG.REGRESSION, TEST_TAG.UI, TEST_TAG.POSITIVE, COMPONENT_TAG.ORDERS, COMPONENT_TAG.CUSTOMERS] },
    async ({ orderUIService, loginUIService, customerApiService }) => {
      await loginUIService.loginAsAdmin();
      await orderUIService.openOrderById(orderId);
      const newCustomerData = await customerApiService.update(customerId, token);
      await orderUIService.clickRefreshOrderButton();
      await orderUIService.assertUpdatedCustomerData(newCustomerData);
    },
  );
});
