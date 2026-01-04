import { ORDER_STATUSES } from "data/types/orders.types";
import { COMPONENT_TAG, TEST_TAG } from "data/types/tags.types";
import { test } from "fixtures";

test.describe("[UI] [Sales Portal] [Orders] [Order Details]", () => {
  let token = "";
  let orderIds: string[] = [];
  test.beforeEach(async ({ loginApiService }) => {
    token = await loginApiService.loginAsAdmin();
  });

  test.afterEach(async ({ ordersApiService }) => {
    if (!orderIds.length) return;
    for (const id of orderIds) {
      await ordersApiService.deleteOrderWithCustomerAndProduct(id, token);
    }
    orderIds = [];
  });

  test(
    "Status is Draft on Order Details page",
    { tag: [TEST_TAG.REGRESSION, TEST_TAG.UI, TEST_TAG.POSITIVE, COMPONENT_TAG.ORDERS] },
    async ({ orderUIService, loginUIService, ordersApiService }) => {
      const order = await ordersApiService.createDraftOrder(token);
      orderIds.push(order._id);
      await loginUIService.loginAsAdmin();
      await orderUIService.openOrderById(order._id);
      await orderUIService.assertStatus(orderUIService.orderPage.orderStatusValue, ORDER_STATUSES.DRAFT);
    },
  );

  test(
    "Status is In Process on Order Details page",
    { tag: [TEST_TAG.REGRESSION, TEST_TAG.UI, TEST_TAG.POSITIVE, COMPONENT_TAG.ORDERS] },
    async ({ orderUIService, loginUIService, ordersApiService }) => {
      const order = await ordersApiService.createInProsessOrder(token, 2);
      orderIds.push(order._id);
      await loginUIService.loginAsAdmin();
      await orderUIService.openOrderById(order._id);
      await orderUIService.assertStatus(orderUIService.orderPage.orderStatusValue, ORDER_STATUSES.IN_PROCESS);
    },
  );

  test(
    "Status is Partially Received on Order Details page",
    { tag: [TEST_TAG.REGRESSION, TEST_TAG.UI, TEST_TAG.POSITIVE, COMPONENT_TAG.ORDERS] },
    async ({ orderUIService, loginUIService, ordersApiService, ordersApi }) => {
      const order = await ordersApiService.createInProsessOrder(token, 2);
      orderIds.push(order._id);
      await ordersApi.markProductsAsReceived(order._id, [order.products[0]!._id], token);

      await loginUIService.loginAsAdmin();
      await orderUIService.openOrderById(order._id);
      await orderUIService.assertStatus(orderUIService.orderPage.orderStatusValue, ORDER_STATUSES.PARTIALLY_RECEIVED);
    },
  );

  test(
    "Status is Received on Order Details page",
    { tag: [TEST_TAG.REGRESSION, TEST_TAG.UI, TEST_TAG.POSITIVE, COMPONENT_TAG.ORDERS] },
    async ({ orderUIService, loginUIService, ordersApiService, ordersApi }) => {
      const order = await ordersApiService.createInProsessOrder(token, 2);
      orderIds.push(order._id);
      await ordersApi.markProductsAsReceived(
        order._id,
        order.products.map((product) => product._id),
        token,
      );

      await loginUIService.loginAsAdmin();
      await orderUIService.openOrderById(order._id);
      await orderUIService.assertStatus(orderUIService.orderPage.orderStatusValue, ORDER_STATUSES.RECEIVED);
    },
  );

  test(
    "Status is Canceled on Order Details page",
    { tag: [TEST_TAG.REGRESSION, TEST_TAG.UI, TEST_TAG.POSITIVE, COMPONENT_TAG.ORDERS] },
    async ({ orderUIService, loginUIService, ordersApiService }) => {
      const order = await ordersApiService.createCanceledOrder(token, 1);
      orderIds.push(order._id);
      await loginUIService.loginAsAdmin();
      await orderUIService.openOrderById(order._id);
      await orderUIService.assertStatus(orderUIService.orderPage.orderStatusValue, ORDER_STATUSES.CANCELED);
    },
  );
});
