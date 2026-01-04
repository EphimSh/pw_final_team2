import { expect, test } from "fixtures";
import type { IOrder } from "data/types/orders.types";

test.describe("[UI] [Sales Portal] [Orders] [Requested products] ", () => {
  let token = "";
  let orderId = "";
  let order: IOrder | null = null;
  let productName: string = "";
  test.beforeAll(async ({ loginApiService, ordersApiService }) => {
    token = await loginApiService.loginAsAdmin();
    const createdOrder = await ordersApiService.createDraftOrder(token, 2);
    order = createdOrder;
    orderId = createdOrder._id;
    const productNames = createdOrder.products.map((product) => product.name);
    productName = productNames[0]!;
  });
  test.afterAll(async ({ ordersApiService }) => {
    if (order) await ordersApiService.deleteOrderWithCustomerAndProduct(order, token);
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
