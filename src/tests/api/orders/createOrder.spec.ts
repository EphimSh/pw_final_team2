import { generateCustomerData, generateCustomerID } from "data/customers/generateCustomerData";
import { generateDeliveryData } from "data/orders/generateDeliveryData";
import { generateProductData, generateProductID } from "data/products/generateProductData";
import { errorSchema } from "data/schemas/index.schema";
import { STATUS_CODES } from "data/statusCode";
import { ORDER_HISTORY_ACTIONS, ORDER_STATUSES } from "data/types/orders.types";
import { test, expect } from "fixtures/api.fixtures";
import { validateResponse } from "utils/validation/validateResponse.utils";

test.describe("[API] [Sales Portal] [Orders] [Create - Positive checks]", () => {
  let token = "";
  let orderID = "";
  let productData = generateProductData();
  let customerData = generateCustomerData();
  test.beforeEach(async ({ loginApiService }) => {
    token = await loginApiService.loginAsAdmin();
  });

  test.afterEach(async ({ ordersApiService }) => {
    if (orderID) await ordersApiService.deleteOrderWithCustomerAndProduct(orderID, token);
  });
  test("SC-054: Successful order creation", async ({
    ordersApi,
    customerApiService,
    productsApiService,
    ordersApiService,
  }) => {
    productData = generateProductData();
    const createdProduct = await productsApiService.create(token, productData);
    const productID = createdProduct._id;
    customerData = generateCustomerData();
    const customer = await customerApiService.create(token, customerData);
    const customerID = customer._id;
    const orderData = { customer: customerID, products: [productID] };
    const orderResponse = await ordersApi.create(orderData, token);
    orderID = orderResponse.body.Order._id;
    await ordersApiService.assertOrderStatus(orderResponse, ORDER_STATUSES.DRAFT);
    expect(orderResponse.body.Order.delivery).toBeNull();
  });
  test("SC-055: Create order with multiple products", async ({ ordersApiService }) => {
    const orderWithDelivery = await ordersApiService.createDraftOrderWithDelivery(token, 3);
    orderID = orderWithDelivery._id;
    const totalPriceFromResponse = orderWithDelivery.total_price;
    const totalPriceCounted = ordersApiService.calculateProductsTotalPrice(orderWithDelivery.products);
    expect(totalPriceCounted).toEqual(totalPriceFromResponse);
  });
  test("SC-108: Successful delivery data creation", async ({ ordersApiService, ordersApi }) => {
    const orderResponse = await ordersApiService.createDraftOrder(token);
    orderID = orderResponse._id;
    const delivery = generateDeliveryData();
    const response = await ordersApi.updateDeliveryDetails(orderID, delivery, token);
    await ordersApiService.assertOrderStatus(response, ORDER_STATUSES.DRAFT);
    expect(response.body.Order.delivery).not.toBeNull();
  });
  test("SC-101: Successful status update Draft → In Process", async ({ ordersApiService, ordersApi }) => {
    const orderWithDelivery = await ordersApiService.createDraftOrderWithDelivery(token);
    orderID = orderWithDelivery._id;
    const updateToInProcess = await ordersApi.updateStatus({ id: orderID, status: ORDER_STATUSES.IN_PROCESS }, token);
    await ordersApiService.assertOrderStatus(updateToInProcess, ORDER_STATUSES.IN_PROCESS);
  });
  test("SC-102: Status update In Process → Canceled", async ({ ordersApiService, ordersApi }) => {
    const orderWithDelivery = await ordersApiService.createDraftOrderWithDelivery(token);
    orderID = orderWithDelivery._id;
    const updateToInProcess = await ordersApi.updateStatus({ id: orderID, status: ORDER_STATUSES.IN_PROCESS }, token);
    await ordersApiService.assertOrderStatus(updateToInProcess, ORDER_STATUSES.IN_PROCESS);
    const updateToCancelled = await ordersApi.updateStatus({ id: orderID, status: ORDER_STATUSES.CANCELED }, token);
    await ordersApiService.assertOrderStatus(updateToCancelled, ORDER_STATUSES.CANCELED);
  });
});
test.describe("[API] [Sales Portal] [Orders] [Create - Negative checks]", () => {
  let token = "";
  test.beforeEach(async ({ loginApiService }) => {
    token = await loginApiService.loginAsAdmin();
  });
  test("SC-056: Missing required field customer", async ({ ordersApi, productsApiService }) => {
    const productData = generateProductData();
    const createdProduct = await productsApiService.create(token, productData);
    const productID = createdProduct._id;
    const orderData = { customer: "", products: [productID] };
    const orderResponse = await ordersApi.create(orderData, token);
    validateResponse(orderResponse, {
      status: STATUS_CODES.NOT_FOUND,
      schema: errorSchema,
      IsSuccess: false,
      ErrorMessage: "Missing customer",
    });
  });
  test("SC-057: Missing required field products", async ({ ordersApi, customerApiService }) => {
    const customerData = generateCustomerData();
    const customer = await customerApiService.create(token, customerData);
    const customerID = customer._id;
    const orderData = { customer: customerID, products: [""] };
    const orderResponse = await ordersApi.create(orderData, token);
    validateResponse(orderResponse, {
      status: STATUS_CODES.SERVER_ERROR,
      schema: errorSchema,
      IsSuccess: false,
      ErrorMessage: "Id was not provided",
    });
  });
  test("SC-058: Empty products arrays", async ({ ordersApi, customerApiService }) => {
    const customerData = generateCustomerData();
    const customer = await customerApiService.create(token, customerData);
    const customerID = customer._id;
    const orderData = { customer: customerID, products: [] };
    const orderResponse = await ordersApi.create(orderData, token);
    validateResponse(orderResponse, {
      status: STATUS_CODES.BAD_REQUEST,
      schema: errorSchema,
      IsSuccess: false,
      ErrorMessage: "Incorrect request body",
    });
  });
  test("SC-059: Non-existent customer ID", async ({ ordersApi, productsApiService }) => {
    const customerID = generateCustomerID();
    const productData = generateProductData();
    const createdProduct = await productsApiService.create(token, productData);
    const productID = createdProduct._id;
    const orderData = { customer: customerID, products: [productID] };
    const orderResponse = await ordersApi.create(orderData, token);
    validateResponse(orderResponse, {
      status: STATUS_CODES.NOT_FOUND,
      schema: errorSchema,
      IsSuccess: false,
      ErrorMessage: `Customer with id '${customerID}' wasn't found`,
    });
  });
  test("SC-060: Invalid customer ID format", async ({ ordersApi, productsApiService }) => {
    const customerID = "invalid_id";
    const productData = generateProductData();
    const createdProduct = await productsApiService.create(token, productData);
    const productID = createdProduct._id;
    const orderData = { customer: customerID, products: [productID] };
    const orderResponse = await ordersApi.create(orderData, token);
    validateResponse(orderResponse, {
      status: STATUS_CODES.SERVER_ERROR,
      schema: errorSchema,
      IsSuccess: false,
      ErrorMessage: 'Cast to ObjectId failed for value "invalid_id" (type string) at path "_id" for model "Customer"',
    });
  });
  test("SC-061: Non-existent product ID in array", async ({ ordersApi, customerApiService }) => {
    const productID = generateProductID();
    const customerData = generateCustomerData();
    const customer = await customerApiService.create(token, customerData);
    const customerID = customer._id;
    const orderData = { customer: customerID, products: [productID] };
    const orderResponse = await ordersApi.create(orderData, token);
    validateResponse(orderResponse, {
      status: STATUS_CODES.NOT_FOUND,
      schema: errorSchema,
      IsSuccess: false,
      ErrorMessage: `Product with id '${productID}' wasn't found`,
    });
  });
  test("SC-062: Check delivery field in response", async ({ ordersApiService }) => {
    const orderResponse = await ordersApiService.createDraftOrder(token);
    expect(orderResponse.delivery).toBeNull();
  });
  test("SC-063: Check order history creation", async ({ ordersApiService }) => {
    const orderResponse = await ordersApiService.createDraftOrder(token);
    expect(orderResponse.history[0]?.action).toBe(ORDER_HISTORY_ACTIONS.CREATED);
  });
});
