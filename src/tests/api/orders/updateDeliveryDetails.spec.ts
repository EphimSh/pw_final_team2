import { generateID } from "data/generateID";
import { generateDeliveryAdressData, generateDeliveryData } from "data/orders/generateDeliveryData";
import { invalidDeliveryAddressData } from "data/orders/invalidDeliveryData.ddt";
import { ordeWithDeliverySchema } from "data/schemas/orders/orderWithDelivery.schema";
import { STATUS_CODES } from "data/statusCode";
import { IDeliveryAddress, IDeliveryInfo } from "data/types/orders.types";
import { test } from "fixtures/api.fixtures";
import { validateResponse } from "utils/validation/validateResponse.utils";

test.describe("[API] [Sales Portal] [Orders] [Update Delivery Details]", () => {
  let token = "";
  let orderID = "";

  test.beforeEach(async ({ loginApiService }) => {
    token = await loginApiService.loginAsAdmin();
  });

  test.afterEach(async ({ ordersApiService }) => {
    if (orderID) await ordersApiService.deleteOrderWithCustomerAndProduct(orderID, token);
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
    const fakeOrderID = generateID();
    const deliveryDetails: IDeliveryInfo = generateDeliveryData();

    const response = await ordersApi.updateDeliveryDetails(fakeOrderID, deliveryDetails, token);
    validateResponse(response, {
      status: STATUS_CODES.NOT_FOUND,
      IsSuccess: false,
    });
  });

  test.describe("[Add invalid delivery address details to Order]", () => {
    for (const caseData of invalidDeliveryAddressData) {
      test(`${caseData.title}`, async ({ ordersApi, ordersApiService }) => {
        const order = await ordersApiService.createDraftOrder(token);
        orderID = order._id;
        const invalidDeliveryDetails = generateDeliveryData({
          address: generateDeliveryAdressData(caseData.deliveryData?.address as Partial<IDeliveryAddress>),
        });

        const response = await ordersApi.updateDeliveryDetails(orderID, invalidDeliveryDetails, token);
        validateResponse(response, {
          status: STATUS_CODES.BAD_REQUEST,
          IsSuccess: false,
          ErrorMessage: caseData.errorMessage,
        });
      });
    }
  });

  // When entering delivery date from the past -> Server accepts it and there is no error
});
