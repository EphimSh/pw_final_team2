import { generateCustomerData } from "data/customers/generateCustomerData";
import { generateProductData } from "data/products/generateProductData";
import { STATUS_CODES } from "data/statusCode";
import { ORDER_STATUSES } from "data/types/orders.types";
import { test, expect } from "fixtures/api.fixtures";
import { validateResponse } from "utils/validation/validateResponse.utils";
import { getOrdersByCustomerSchema } from "data/schemas/orders/getOrdersByCustomer.schema";

test.describe("[API] [Sales Portal] [Orders] [Get Orders by Customers]", () => {
  let token = "";
  let orderID1 = "";
  let orderID2 = "";
  let customerID = "";
  let productID1 = "";
  let productID2 = "";
  test.beforeEach(async ({ loginApiService, customerApiService, productsApiService, ordersApi, ordersApiService }) => {
    token = await loginApiService.loginAsAdmin();
    const productData1 = generateProductData();
    const productData2 = generateProductData();
    const customerData = generateCustomerData();

    const customer = await customerApiService.create(token, customerData);
    customerID = customer._id;

    const createdProduct1 = await productsApiService.create(token, productData1);
    productID1 = createdProduct1._id;
    const orderData1 = { customer: customerID, products: [productID1] };
    const orderResponse1 = await ordersApi.create(orderData1, token);
    orderID1 = orderResponse1.body.Order._id;
    await ordersApiService.assertOrderStatus(orderResponse1, ORDER_STATUSES.DRAFT);

    const createdProduct2 = await productsApiService.create(token, productData2);
    productID2 = createdProduct2._id;
    const orderData2 = { customer: customerID, products: [productID2] };
    const orderResponse2 = await ordersApi.create(orderData2, token);
    orderID2 = orderResponse2.body.Order._id;
    await ordersApiService.assertOrderStatus(orderResponse2, ORDER_STATUSES.DRAFT);
  });
  test.afterEach(async ({ ordersApiService, customerApiService, productsApiService }) => {
    if (orderID1) await ordersApiService.deleteOrder(orderID1, token);
    if (orderID2) await ordersApiService.deleteOrder(orderID2, token);
    if (customerID) await customerApiService.delete(token, customerID);
    if (productID1) await productsApiService.delete(token, productID1);
    if (productID2) await productsApiService.delete(token, productID2);
  });
  test("SC-065: Search order by customer name", async ({ ordersApi }) => {
    const response = await ordersApi.getOrdersByCustomer(customerID, token);
    console.log("Orders: " + response.body.Orders);
    validateResponse(response, {
      status: STATUS_CODES.OK,
      IsSuccess: true,
      ErrorMessage: null,
      schema: getOrdersByCustomerSchema,
    });

    const orders = response.body.Orders;
    expect(orders.length).toBeGreaterThanOrEqual(2);

    const orderIds = orders.map((order) => order._id);
    expect(orderIds).toContain(orderID1);
    expect(orderIds).toContain(orderID2);

    orders.forEach((order) => {
      expect(order.customer).toBe(customerID);
    });
  });
});
