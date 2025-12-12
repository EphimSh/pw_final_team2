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

  test("Delete comment from Order", async ({ ordersApi }) => {
    //const orderID = orderResponse.body.Order._id;
    const orderID = "693b52994e61bcd793438b93";

    const comment = "My new comment 4";
    const commentResponse = await ordersApi.addComment(orderID, token, comment);

    const comments = await commentResponse.body.Order.comments;

    //console.log(comments);

    const correctComment = comments.find((c) => {
      console.log("c.text => " + c.text);
      console.log("comment => " + comment);
      return c.text === comment;
    });
    console.log("correctComment" + correctComment);

    const commentID = correctComment?._id;

    await ordersApi.deleteComment(token, orderID, commentID!);
  });
});
