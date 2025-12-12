// import { generateCustomerData } from "data/customers/generateCustomerData";
// import { generateProductData } from "data/products/generateProductData";
// import { IResponse } from "data/types/core.types";
// import { IOrder, IOrderResponse } from "data/types/orders.types";
import { test } from "fixtures/api.fixtures";

test.describe("[API] [Sales Portal] [Orders] [Add Comment]", () => {
  let token = "";
  // let productID = "";
  // let customerID = "";
  // let order: IOrder;
  // let orderResponse: IResponse<IOrderResponse>;

  test.beforeEach(async ({ loginApiService }) => {
    token = await loginApiService.loginAsAdmin();

    // const productData = generateProductData();
    // const createdProduct = await productsApiService.create(token, productData);
    // productID = createdProduct._id;

    // const customerData =  generateCustomerData();
    // const customer = await customerApiService.create(token, customerData);
    // customerID = customer._id;

    // const orderData = { customer: customerID, products: [productID] };
    // orderResponse = await ordersApi.create(orderData, token);
  });

  test("Add comment to Order", async ({ ordersApi }) => {
    //const orderID = orderResponse.body.Order._id;
    const orderID = "693b52994e61bcd793438b93";

    const comment = "My new comment";
    await ordersApi.addComment(orderID, token, comment);
  });
});
