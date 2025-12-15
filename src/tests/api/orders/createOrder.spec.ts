import { generateCustomerData } from "data/customers/generateCustomerData";
import { generateDelivery } from "data/orders/delivery";
import { generateProductData } from "data/products/generateProductData";
import { ORDER_STATUSES } from "data/types/orders.types";
import { test, expect } from "fixtures/api.fixtures";

test.describe("[API] [Sales Portal] [Orders] [Create]", () => {
  let token = "";
  let orderID = "";
  test.beforeEach(async ({ loginApiService }) => {
    token = await loginApiService.loginAsAdmin();
  });

  test.afterEach(async ({ ordersApiService }) => {
    if (orderID) await ordersApiService.deleteOrder(orderID, token);
  });

  test("Create Draft Order", async ({ ordersApi, customerApiService, productsApiService }) => {
    const productData = generateProductData();
    const createdProduct = await productsApiService.create(token, productData);
    const productID = createdProduct._id;

    const customerData = generateCustomerData();
    const customer = await customerApiService.create(token, customerData);
    const customerID = customer._id;

    const orderData = { customer: customerID, products: [productID] };
    const orderResponse = await ordersApi.create(orderData, token);
    orderID = orderResponse.body.Order._id;
    console.log(orderResponse);
    expect(orderResponse.body.Order.status).toEqual("Draft");
    expect(orderResponse.body.Order.delivery).toBeNull();
  });
  test("Update Draft Order with Delivery", async ({ ordersApiService, ordersApi }) => {
    const orderResponse = await ordersApiService.createDraftOrder(token);
    orderID = orderResponse._id;
    const delivery = generateDelivery();
    const response = await ordersApi.updateDeliveryDetails(orderID, delivery, token);
    console.log(orderResponse);
    expect(response.body.Order.delivery).not.toBeNull();
  });
  test("Update Order Status to In Process", async ({ ordersApiService, ordersApi }) => {
    const orderWithDelivery = await ordersApiService.createDraftOrderWithDelivery(token);
    orderID = orderWithDelivery._id;
    const updateToInProcess = await ordersApi.updateStatus({ id: orderID, status: ORDER_STATUSES.IN_PROCESS }, token);
    console.log(updateToInProcess);
    expect(updateToInProcess.body.Order.status).toEqual(ORDER_STATUSES.IN_PROCESS);
  });
  test("Update Order Status to Cancelled", async ({ ordersApiService, ordersApi }) => {
    const orderWithDelivery = await ordersApiService.createDraftOrderWithDelivery(token);
    orderID = orderWithDelivery._id;
    const updateToInProcess = await ordersApi.updateStatus({ id: orderID, status: ORDER_STATUSES.CANCELED }, token);
    console.log(updateToInProcess);
    expect(updateToInProcess.body.Order.status).toEqual(ORDER_STATUSES.CANCELED);
  });
});
