import { STATUS_CODES } from "data/statusCode";
import { test } from "fixtures/api.fixtures";
import { validateResponse } from "utils/validation/validateResponse.utils";

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

  test("Delete comment from Order", async ({ ordersApi }) => {
    //const orderID = orderResponse.body.Order._id;
    const orderID = "693b52994e61bcd793438b93";

    const comment = "My new comment 4";
    const commentResponse = await ordersApi.addComment(orderID, token, comment);
    const comments = commentResponse.body.Order.comments;
    const correctComment = comments.find((c: { text: string }) => c.text === comment);

    const commentID = correctComment?._id;

    const response = await ordersApi.deleteComment(token, orderID, commentID!);
    validateResponse(response, {
      status: STATUS_CODES.DELETED,
      //IsSuccess: true,
      ErrorMessage: null,
    });

    //const orderComments = response.body.Order.comments;
    //expect(orderComments.find((c: { text: string }) => c.text === comment)).toBeFalsy();
  });
});
