import { generateID } from "data/generateID";
import { generateDeliveryAdressData, generateDeliveryData } from "data/orders/generateDeliveryData";
import { invalidDeliveryAddressData } from "data/orders/invalidDeliveryData.ddt";
import { ordeWithDeliverySchema } from "data/schemas/orders/orderWithDelivery.schema";
import { STATUS_CODES } from "data/statusCode";
import { IDeliveryAddress, IDeliveryInfo } from "data/types/orders.types";
import { TEST_TAG, COMPONENT_TAG } from "data/types/tags.types";
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

  test(
    "SC-108: Successful delivery data creation",
    {
      tag: [
        TEST_TAG.REGRESSION,
        TEST_TAG.SMOKE,
        TEST_TAG.API,
        TEST_TAG.POSITIVE,
        COMPONENT_TAG.ORDERS,
        COMPONENT_TAG.DELIVERY,
      ],
    },
    async ({ ordersApi, ordersApiService }) => {
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
    },
  );

  test(
    "SC-109: Update existing delivery data",
    {
      tag: [
        TEST_TAG.REGRESSION,
        TEST_TAG.SMOKE,
        TEST_TAG.API,
        TEST_TAG.POSITIVE,
        COMPONENT_TAG.ORDERS,
        COMPONENT_TAG.DELIVERY,
      ],
    },
    async ({ ordersApi, ordersApiService }) => {
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
    },
  );

  test(
    "SC-117: Non-existent order ID",
    {
      tag: [TEST_TAG.REGRESSION, TEST_TAG.API, TEST_TAG.NEGATIVE, COMPONENT_TAG.ORDERS, COMPONENT_TAG.DELIVERY],
    },
    async ({ ordersApi }) => {
      const fakeOrderID = generateID();
      const deliveryDetails: IDeliveryInfo = generateDeliveryData();

      const response = await ordersApi.updateDeliveryDetails(fakeOrderID, deliveryDetails, token);
      validateResponse(response, {
        status: STATUS_CODES.NOT_FOUND,
        IsSuccess: false,
      });
    },
  );

  test.describe("[Add invalid delivery address details to Order]", () => {
    for (const caseData of invalidDeliveryAddressData) {
      test(
        `${caseData.title}`,
        {
          tag: [TEST_TAG.REGRESSION, TEST_TAG.API, TEST_TAG.NEGATIVE, COMPONENT_TAG.ORDERS, COMPONENT_TAG.DELIVERY],
        },
        async ({ ordersApi, ordersApiService }) => {
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
        },
      );
    }
  });

  // When entering delivery date from the past -> Server accepts it and there is no error
});
