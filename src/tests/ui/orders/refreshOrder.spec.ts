import { test } from "fixtures";

test.describe("[UI] [Sales Portal] [Orders] [Order Details]", () => {
  let token = "";
  let orderId = "";
  let customerId = "";
  let productId = "";

  test.beforeAll(async ({ loginApiService, ordersApiService }) => {
    token = await loginApiService.loginAsAdmin();
    const order = await ordersApiService.createDraftOrder(token, 1);
    orderId = order._id;
    customerId = order.customer._id;
    productId = order.products[0]!._id;
  });

  test.afterAll(async ({ ordersApiService, customerApiService, productsApiService }) => {
    if (orderId) await ordersApiService.deleteOrder(orderId, token);
    await productsApiService.delete(token, productId);
    if (customerId) await customerApiService.delete(token, customerId);
  });

  test("Refresh Order", async ({ orderUIService, loginUIService, customerApiService }) => {
    await loginUIService.loginAsAdmin();
    await orderUIService.openOrderById(orderId);
    const newCustomerData = await customerApiService.update(customerId, token);
    await orderUIService.clickRefreshOrderButton();
    await orderUIService.assertUpdatedCustomerData(newCustomerData);
  });
});
