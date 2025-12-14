import { generateDeliveryData } from "data/orders/generateDeliveryData";
import { STATUS_CODES } from "data/statusCode";
import { IDeliveryInfo } from "data/types/orders.types";
import { test } from "fixtures/api.fixtures";
import { validateResponse } from "utils/validation/validateResponse.utils";

test.describe("[API] [Sales Portal] [Orders] [Update Delivery Details]", () => {
  let token = "";
  // let productID = "";
  // let customerID = "";
  // let order: IOrder;
  // let orderResponse: IResponse<IOrderResponse>;

  test.beforeEach(async ({ loginApiService }) => {
    token = await loginApiService.loginAsAdmin();
  });

  test("Update Delivery Details for Order", async ({ ordersApi }) => {
    const orderID = "693b52424e61bcd793438b70";

    const deliveryDetails: IDeliveryInfo = generateDeliveryData();
    // address: {
    //     country: "USA",
    //     city: "Metropolis",
    //     street: "123 Main St",
    //     house: 16,
    //     flat: 4,
    // },
    // finalDate: "2024-12-31",
    // condition: DELIVERY_CONDITIONS.DELIVERY,
    //}

    const response = await ordersApi.updateDeliveryDetails(orderID, token, deliveryDetails);
    validateResponse(response, {
      status: STATUS_CODES.OK,
      IsSuccess: true,
      ErrorMessage: null,
      // schema: ???, // Add schema validation if available
    });
  });
});
