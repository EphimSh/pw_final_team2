import { generateDeliveryData } from "data/orders/generateDeliveryData";
import { STATUS_CODES } from "data/statusCode";
import { IDeliveryInfo } from "data/types/orders.types";
import { test } from "fixtures/api.fixtures";
import { validateResponse } from "utils/validation/validateResponse.utils";

test.describe("[API] [Sales Portal] [Orders] [Products as Received]", () => {
  let token = "";
  // let productID = "";
  // let customerID = "";
  // let order: IOrder;
  // let orderResponse: IResponse<IOrderResponse>;

  test.beforeEach(async ({ loginApiService }) => {
    token = await loginApiService.loginAsAdmin();
  });

  test("Mark products as received in order", async ({ ordersApi }) => {
    const orderID = "693b4edb4e61bcd793438afc";

    const deliveryDetails: IDeliveryInfo = generateDeliveryData();
    await ordersApi.updateDeliveryDetails(orderID, token, deliveryDetails);

    //update status

    const orderResponse = await ordersApi.getById(orderID, token);
    const orderProductsIDs = orderResponse.body.Order.products.map((p) => p._id);

    const response = await ordersApi.markProductsAsReceived(orderID, token, orderProductsIDs);
    validateResponse(response, {
      status: STATUS_CODES.OK,
      IsSuccess: true,
      ErrorMessage: null,
      // schema: ???, // Add schema validation if available
    });
  });
});
