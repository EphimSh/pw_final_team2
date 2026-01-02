import { generateCustomerData } from "data/customers/generateCustomerData";
import { generateProductData } from "data/products/generateProductData";
import { STATUS_CODES } from "data/statusCode";
import { ORDER_STATUSES } from "data/types/orders.types";
import { test, expect } from "fixtures/api.fixtures";
import { validateResponse } from "utils/validation/validateResponse.utils";
import { getOrdersByCustomerSchema } from "data/schemas/orders/getOrdersByCustomer.schema";

test.describe("[API] [Sales Portal] [Orders] [Get Orders by Customers]", () => {
  let token = "";

  test.beforeEach(async ({ loginApiService }) => {
    token = await loginApiService.loginAsAdmin();
  });

  // test.afterEach(async ({ ordersApiService }) => {
  //   if (orderID1) await ordersApiService.deleteOrderWithCustomerAndProduct(orderID1, token);
  //   if (orderID2) await ordersApiService.deleteOrderWithCustomerAndProduct(orderID2, token);
  // });

  test("SC-065: Search order by customer name", async ({
    ordersApi,
    productsApiService,
    customerApiService,
    ordersApiService,
  }) => {
    const productData1 = generateProductData();
    const productData2 = generateProductData();
    const customerData = generateCustomerData();

    const customer = await customerApiService.create(token, customerData);
    const customerID = customer._id;

    const createdProduct1 = await productsApiService.create(token, productData1);
    const productID1 = createdProduct1._id;
    const orderData1 = { customer: customerID, products: [productID1] };
    const orderResponse1 = await ordersApi.create(orderData1, token);
    const orderID1 = await orderResponse1.body.Order._id;
    await ordersApiService.assertOrderStatus(orderResponse1, ORDER_STATUSES.DRAFT);

    const createdProduct2 = await productsApiService.create(token, productData2);
    const productID2 = createdProduct2._id;
    const orderData2 = { customer: customerID, products: [productID2] };
    const orderResponse2 = await ordersApi.create(orderData2, token);
    const orderID2 = await orderResponse2.body.Order._id;
    await ordersApiService.assertOrderStatus(orderResponse2, ORDER_STATUSES.DRAFT);

    console.log(orderResponse1.body.Order._id);
    console.log(orderResponse2.body.Order._id);

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
  });
});
