import { expect, test } from "fixtures";

test.describe("[UI] [Sales Portal] [Orders] [Requested products] ", () => {
  let token = "";
  let orderId = "";
  let customerId = "";
  let productIds: string[] = [];
  let productName: string = "";
  test.beforeAll(async ({ loginApiService, ordersApiService }) => {
    token = await loginApiService.loginAsAdmin();
    const order = await ordersApiService.createDraftOrder(token, 2);
    orderId = order._id;
    customerId = order.customer._id;
    productIds = order.products.map((product) => product._id);
    const productNames = order.products.map((product) => product.name);
    productName = productNames[0]!;
  });
  test.afterAll(async ({ ordersApiService, customerApiService, productsApiService }) => {
    if (orderId) await ordersApiService.deleteOrder(orderId, token);
    for (const productId of productIds) {
      await productsApiService.delete(token, productId);
    }
    if (customerId) await customerApiService.delete(token, customerId);
  });
  test("SC-025: Delete Product From Order", async ({ orderUIService, orderPage }) => {
    await orderUIService.openOrderById(orderId);
    await orderPage.waitForSpinners();
    await orderPage.requestedOrders.open();
    await expect(orderPage.editProductsModal.uniqueElement).toBeVisible();
    const initialCount = await orderPage.editProductsModal.getProductsCount();
    expect(initialCount).toBe(2);
    await orderPage.editProductsModal.deleteProduct(productName);
    const updatedCount = await orderPage.editProductsModal.getProductsCount();
    expect(updatedCount).toBe(1);
    await orderPage.editProductsModal.saveProduct();
    await orderPage.editProductsModal.waitForClosed();
  });
});
