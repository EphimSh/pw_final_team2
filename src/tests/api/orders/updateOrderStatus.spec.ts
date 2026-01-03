import { ordeWithDeliverySchema } from "data/schemas/orders/orderWithDelivery.schema";
import { STATUS_CODES } from "data/statusCode";
import { ORDER_STATUSES } from "data/types/orders.types";
import { TEST_TAG, COMPONENT_TAG } from "data/types/tags.types";
import { expect, test } from "fixtures/api.fixtures";
import { validateResponse } from "utils/validation/validateResponse.utils";

test.describe("[API] [Sales Portal] [Orders] [Update Status]", () => {
  let token = "";
  let orderID = "";

  test.beforeEach(async ({ loginApiService }) => {
    token = await loginApiService.loginAsAdmin();
  });

  test.afterEach(async ({ ordersApiService }) => {
    if (orderID) await ordersApiService.deleteOrder(orderID, token);
  });

  test(
    "Update status of Order to => InProcess",
    {
      tag: [TEST_TAG.REGRESSION, TEST_TAG.SMOKE, TEST_TAG.API, TEST_TAG.POSITIVE, COMPONENT_TAG.ORDERS],
    },
    async ({ ordersApi, ordersApiService }) => {
      const order = await ordersApiService.createDraftOrderWithDelivery(token);
      orderID = order._id;
      const newStatus = ORDER_STATUSES.IN_PROCESS;

      const response = await ordersApi.updateStatus({ id: orderID, status: newStatus }, token);
      validateResponse(response, {
        status: STATUS_CODES.OK,
        IsSuccess: true,
        ErrorMessage: null,
      });

      expect(response.body.Order.status).toBe(newStatus);
    },
  );

  test(
    "Update status of Order to => Partially Received",
    {
      tag: [TEST_TAG.REGRESSION, TEST_TAG.API, TEST_TAG.POSITIVE, COMPONENT_TAG.ORDERS],
    },
    async ({ ordersApi, ordersApiService }) => {
      const order = await ordersApiService.createInProsessOrder(token, 2);
      const productID = order.products[0]!._id;
      console.log("PRODUCT ID: ", productID);
      orderID = order._id;

      const response = await ordersApi.markProductsAsReceived(orderID, [productID], token);
      validateResponse(response, {
        status: STATUS_CODES.OK,
        IsSuccess: true,
        ErrorMessage: null,
      });

      expect(response.body.Order.status).toBe(ORDER_STATUSES.PARTIALLY_RECEIVED);
    },
  );

  test(
    "Update status of Order to => Received",
    {
      tag: [TEST_TAG.REGRESSION, TEST_TAG.SMOKE, TEST_TAG.API, TEST_TAG.POSITIVE, COMPONENT_TAG.ORDERS],
    },
    async ({ ordersApi, ordersApiService }) => {
      const order = await ordersApiService.createInProsessOrder(token, 2);
      orderID = order._id;
      const orderProductsIDs = order.products.map((p) => p._id);

      const response = await ordersApi.markProductsAsReceived(orderID, orderProductsIDs, token);
      validateResponse(response, {
        status: STATUS_CODES.OK,
        IsSuccess: true,
        ErrorMessage: null,
        schema: ordeWithDeliverySchema,
      });
      expect(response.body.Order.status).toBe(ORDER_STATUSES.RECEIVED);
    },
  );

  test(
    "Update status of Order to => Canceled",
    {
      tag: [TEST_TAG.REGRESSION, TEST_TAG.API, TEST_TAG.POSITIVE, COMPONENT_TAG.ORDERS],
    },
    async ({ ordersApi, ordersApiService }) => {
      const order = await ordersApiService.createDraftOrderWithDelivery(token);
      orderID = order._id;
      const newStatus = ORDER_STATUSES.CANCELED;

      const response = await ordersApi.updateStatus({ id: orderID, status: newStatus }, token);
      validateResponse(response, {
        status: STATUS_CODES.OK,
        IsSuccess: true,
        ErrorMessage: null,
      });

      expect(response.body.Order.status).toBe(newStatus);
    },
  );
});
