import { generateCustomerData } from "data/customers/generateCustomerData";
import { generateID } from "data/generateID";
import { generateDeliveryData } from "data/orders/generateDeliveryData";
import { generateProductData } from "data/products/generateProductData";
import { errorSchema } from "data/schemas/core.schema";
import { createOrderSchema } from "data/schemas/orders/create.schema";
import { STATUS_CODES } from "data/statusCode";
import { IOrderCreateBody, ORDER_STATUSES } from "data/types/orders.types";
import { expect, test } from "fixtures/api.fixtures";
import { validateResponse } from "utils/validation/validateResponse.utils";

test.describe("[API] [Sales Portal] [Orders] [Update Order]", () => {
  let token = "";
  let orderID = "";
  let orderData: IOrderCreateBody;
  const productData = generateProductData();
  let productID: string;
  const customerData = generateCustomerData();
  let customerID: string;
  let extraProductIds: string[] = [];
  let extraCustomerIds: string[] = [];

  test.beforeEach(async ({ loginApiService, productsApiService, customerApiService }) => {
    token = await loginApiService.loginAsAdmin();

    const createdProduct = await productsApiService.create(token, productData);
    productID = createdProduct._id;

    const createdCustomer = await customerApiService.create(token, customerData);
    customerID = createdCustomer._id;
    orderData = { customer: customerID, products: [productID] };
  });

  test.afterEach(async ({ ordersApiService, productsApiService, customerApiService }) => {
    if (orderData) await ordersApiService.deleteOrder(orderID, token);
    for (const id of extraProductIds) {
      await productsApiService.delete(token, id);
    }
    for (const id of extraCustomerIds) {
      await customerApiService.delete(token, id);
    }
    if (productData) await productsApiService.delete(token, productID);
    if (customerData) await customerApiService.delete(token, customerID);
    extraProductIds = [];
    extraCustomerIds = [];
    if (token) token = "";
    if (orderID) orderID = "";
    if (customerID) customerID = "";
    if (productID) productID = "";
  });

  test("Successful customer update", async ({ ordersApi, customerApiService }) => {
    const orderResponse = await ordersApi.create(orderData, token);
    orderID = orderResponse.body.Order._id;
    const lengthHistory = orderResponse.body.Order.history.length;

    const newCustomer = await customerApiService.create(token, generateCustomerData());
    extraCustomerIds.push(newCustomer._id);
    orderData.customer = newCustomer._id;
    const response = await ordersApi.update(orderID, orderData, token);

    validateResponse(response, {
      status: STATUS_CODES.OK,
      IsSuccess: true,
      ErrorMessage: null,
      schema: createOrderSchema,
    });

    expect(response.body.Order.history.some((el) => el.customer === newCustomer._id)).toBe(true);
    expect(response.body.Order.history.length).toBe(lengthHistory + 1);
  });

  test("Successful products update", async ({ ordersApi, productsApiService }) => {
    const orderResponse = await ordersApi.create(orderData, token);
    orderID = orderResponse.body.Order._id;
    const previousProducts = orderResponse.body.Order.products;
    const previousTotalPrice = orderResponse.body.Order.total_price;
    console.log(orderResponse.body.Order.total_price);

    const newProduct1 = await productsApiService.create(token, generateProductData());
    const newProduct2 = await productsApiService.create(token, generateProductData());
    extraProductIds.push(newProduct1._id, newProduct2._id);
    orderData.products = [newProduct1._id, newProduct2._id];
    const response = await ordersApi.update(orderID, orderData, token);

    validateResponse(response, {
      status: STATUS_CODES.OK,
      IsSuccess: true,
      ErrorMessage: null,
      schema: createOrderSchema,
    });

    expect(response.body.Order.products).not.toBe(previousProducts);
    expect(response.body.Order.total_price).not.toBe(previousTotalPrice);
  });

  test("Update all fields simultaneously", async ({ ordersApi, productsApiService, customerApiService }) => {
    const orderResponse = await ordersApi.create(orderData, token);
    orderID = orderResponse.body.Order._id;
    const previousProducts = orderResponse.body.Order.products;
    const previousTotalPrice = orderResponse.body.Order.total_price;
    const lengthHistory = orderResponse.body.Order.history.length;

    const newProduct1 = await productsApiService.create(token, generateProductData());
    const newProduct2 = await productsApiService.create(token, generateProductData());
    extraProductIds.push(newProduct1._id, newProduct2._id);
    orderData.products = [newProduct1._id, newProduct2._id];

    const newCustomer = await customerApiService.create(token, generateCustomerData());
    extraCustomerIds.push(newCustomer._id);
    orderData.customer = newCustomer._id;
    const response = await ordersApi.update(orderID, orderData, token);

    validateResponse(response, {
      status: STATUS_CODES.OK,
      IsSuccess: true,
      ErrorMessage: null,
      schema: createOrderSchema,
    });

    expect(response.body.Order.history.some((el) => el.customer === newCustomer._id)).toBe(true);
    expect(response.body.Order.history.length).toBe(lengthHistory + 1);
    expect(response.body.Order.products).not.toBe(previousProducts);
    expect(response.body.Order.total_price).not.toBe(previousTotalPrice);
  });

  test("Missing required fields", async ({ ordersApi }) => {
    const orderResponse = await ordersApi.create(orderData, token);
    orderID = orderResponse.body.Order._id;
    orderData.products = [];
    const response = await ordersApi.update(orderID, orderData, token);

    validateResponse(response, {
      status: STATUS_CODES.BAD_REQUEST,
      IsSuccess: false,
      ErrorMessage: null,
      schema: errorSchema,
    });
  });

  test("Attempt to update order with Received status", async ({ ordersApi }) => {
    const orderResponse = await ordersApi.create(orderData, token);
    orderID = orderResponse.body.Order._id;

    const delivery = generateDeliveryData();
    await ordersApi.updateDeliveryDetails(orderID, delivery, token);
    await ordersApi.updateStatus({ id: orderID, status: ORDER_STATUSES.IN_PROCESS }, token);
    await ordersApi.markProductsAsReceived(orderID, orderData.products, token);
    const response = await ordersApi.update(orderID, orderData, token);

    validateResponse(response, {
      status: STATUS_CODES.BAD_REQUEST,
      IsSuccess: false,
      ErrorMessage: null,
      schema: errorSchema,
    });
  });

  test("Attempt to update order with Canceled status", async ({ ordersApi }) => {
    const orderResponse = await ordersApi.create(orderData, token);
    orderID = orderResponse.body.Order._id;
    await ordersApi.updateStatus({ id: orderID, status: ORDER_STATUSES.CANCELED }, token);
    const response = await ordersApi.update(orderID, orderData, token);

    validateResponse(response, {
      status: STATUS_CODES.BAD_REQUEST,
      IsSuccess: false,
      ErrorMessage: null,
      schema: errorSchema,
    });
  });

  test("Non-existent order ID", async ({ ordersApi }) => {
    const orderResponse = await ordersApi.create(orderData, token);
    orderID = generateID();
    await ordersApi.updateStatus({ id: orderID, status: ORDER_STATUSES.CANCELED }, token);
    const response = await ordersApi.update(orderID, orderData, token);

    validateResponse(response, {
      status: STATUS_CODES.NOT_FOUND,
      IsSuccess: false,
      ErrorMessage: null,
      schema: errorSchema,
    });
    orderID = orderResponse.body.Order._id;
  });
});
