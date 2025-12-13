import { generateCustomerData } from "data/customers/generateCustomerData";
import { generateDelivery } from "data/orders/delivery";
import { generateProductData } from "data/products/generateProductData";
import { test, expect } from "fixtures/api.fixtures";

test.describe("[API] [Sales Portal] [Orders] [Create]", () => {
  let token = "";
  test.beforeEach(async ({ loginApiService }) => {
    token = await loginApiService.loginAsAdmin();
  });
  test("Create Draft Order", async ({ ordersApi, customerApiService, productsApiService }) => {
    const productData = generateProductData();
    const createdProduct = await productsApiService.create(token, productData);
    const productID = createdProduct._id;

    const customerData = generateCustomerData();
    const customer = await customerApiService.create(token, customerData);
    const customerID = customer._id;

    const orderData = { customer: customerID, products: [productID] };
    const orderResponse = await ordersApi.create(orderData, token);
    console.log(orderResponse);
    expect(orderResponse.body.Order.status).toEqual("Draft");
    expect(orderResponse.body.Order.delivery).toBeNull();
  });
  test("Update Draft Order", async ({ ordersApiService, ordersApi }) => {
    const orderResponse = await ordersApiService.createDraftOrder(token);
    const orderID = orderResponse._id;
    const delivery = await generateDelivery();
    const response = await ordersApi.updateDelivery(orderID, delivery, token);
    console.log(orderResponse);
    expect(response.body.Order.delivery).not.toBeNull();
  });
});
