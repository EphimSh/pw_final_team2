import { ORDER_STATUSES } from "data/types/orders.types";
import { test } from "fixtures";

test.describe("[UI] [Sales Portal] [Orders] [Order Details]", () => {
  let token = "";
  let orderId = "";
  let customerId = "";
  let productIds: string[] = [];

  test.beforeAll(async ({ loginApiService, ordersApiService }) => {
    token = await loginApiService.loginAsAdmin();
    const order = await ordersApiService.createDraftOrder(token);
    orderId = order._id;
    customerId = order.customer._id;
    productIds = order.products.map((product) => product._id);
  });

  test.afterAll(async ({ ordersApiService, customerApiService, productsApiService }) => {
    if (orderId) await ordersApiService.deleteOrder(orderId, token);
    for (const productId of productIds) {
      await productsApiService.delete(token, productId);
    }
    if (customerId) await customerApiService.delete(token, customerId);
  });

  test("Status is 'draft' when products and customers added", async ({ orderUIService, loginUIService }) => {
    await loginUIService.loginAsAdmin();
    await orderUIService.openOrderById(orderId);
    await orderUIService.assertStatus(orderUIService.orderPage.orderStatusValue, ORDER_STATUSES.DRAFT);
  });
});
