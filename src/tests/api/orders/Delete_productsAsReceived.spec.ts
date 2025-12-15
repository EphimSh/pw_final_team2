import { ordeWithDeliverySchema } from "data/schemas/orders/orderWithDelivery.schema";
import { STATUS_CODES } from "data/statusCode";
import { IOrderResponse } from "data/types/orders.types";
import { test } from "fixtures/api.fixtures";
import { validateResponse } from "utils/validation/validateResponse.utils";

test.describe("[API] [Sales Portal] [Orders] [Products as Received]", () => {
  let token = "";
  let orderID = "";
  let order: IOrderResponse["Order"];

  test.beforeEach(async ({ loginApiService, ordersApiService }) => {
    token = await loginApiService.loginAsAdmin();
    order = await ordersApiService.createInProsessOrder(token, 2);
    orderID = order._id;
  });

  test("Mark products as received in order", async ({ ordersApi }) => {
    const orderProductsIDs = order.products.map((p) => p._id);

    const response = await ordersApi.markProductsAsReceived(orderID, orderProductsIDs, token);
    validateResponse(response, {
      status: STATUS_CODES.OK,
      IsSuccess: true,
      ErrorMessage: null,
      schema: ordeWithDeliverySchema,
    });
  });
});
