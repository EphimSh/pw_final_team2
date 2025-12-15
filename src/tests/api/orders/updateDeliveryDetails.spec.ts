import { ERROR_MESSAGES } from "data/notifications/notifications";
import { generateDeliveryAdressData, generateDeliveryData } from "data/orders/generateDeliveryData";
import { ordeWithDeliverySchema } from "data/schemas/orders/orderWithDelivery.schema";
import { STATUS_CODES } from "data/statusCode";
import { IDeliveryInfo } from "data/types/orders.types";
import { test } from "fixtures/api.fixtures";
import { validateResponse } from "utils/validation/validateResponse.utils";

test.describe("[API] [Sales Portal] [Orders] [Update Delivery Details]", () => {
  let token = "";
  let orderID = "";

  test.beforeEach(async ({ loginApiService }) => {
    token = await loginApiService.loginAsAdmin();
  });

  test.afterEach(async ({ ordersApiService }) => {
    if (orderID) await ordersApiService.deleteOrder(orderID, token);
  });

  test("Add Delivery Details for Order", async ({ ordersApi, ordersApiService }) => {
    const order = await ordersApiService.createDraftOrder(token);
    orderID = order._id;
    const deliveryDetails: IDeliveryInfo = generateDeliveryData();

    const response = await ordersApi.updateDeliveryDetails(orderID, deliveryDetails, token);
    validateResponse(response, {
      status: STATUS_CODES.OK,
      IsSuccess: true,
      ErrorMessage: null,
      schema: ordeWithDeliverySchema,
    });
  });

  test("Edit Delivery Details for Order", async ({ ordersApi, ordersApiService }) => {
    const order = await ordersApiService.createDraftOrderWithDelivery(token);
    orderID = order._id;
    const newDeliveryDetails: IDeliveryInfo = generateDeliveryData();

    const response = await ordersApi.updateDeliveryDetails(orderID, newDeliveryDetails, token);
    validateResponse(response, {
      status: STATUS_CODES.OK,
      IsSuccess: true,
      ErrorMessage: null,
      schema: ordeWithDeliverySchema,
    });

    const updatedDelivery = response.body.Order.delivery;
    ordersApiService.assertDeliveryDetailsAreEdited(newDeliveryDetails, updatedDelivery!);
  });

  test("Add delivery details to non-existing Order", async ({ ordersApi }) => {
    const fakeOrderID = "64b7f0f5e1f2c8a1b2c3d4e5";
    const deliveryDetails: IDeliveryInfo = generateDeliveryData();

    const response = await ordersApi.updateDeliveryDetails(fakeOrderID, deliveryDetails, token);
    validateResponse(response, {
      status: STATUS_CODES.NOT_FOUND,
      IsSuccess: false,
    });
  });

  // Add ddt for invalid delivery details
  test("Add invalid delivery details to Order", async ({ ordersApi, ordersApiService }) => {
    const order = await ordersApiService.createDraftOrder(token);
    orderID = order._id;
    const invalidDeliveryDetails = generateDeliveryData({
      address: generateDeliveryAdressData({ country: "Honolulu" }),
    });
    const response = await ordersApi.updateDeliveryDetails(orderID, invalidDeliveryDetails, token);
    validateResponse(response, {
      status: STATUS_CODES.BAD_REQUEST,
      IsSuccess: false,
      ErrorMessage: ERROR_MESSAGES.BAD_REQUEST,
    });
  });
});
