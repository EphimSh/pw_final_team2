import { generateCustomerData } from "data/customers/generateCustomerData";
import { generateProductData } from "data/products/generateProductData";
import { IProduct } from "data/types/products.types";
import { test, expect } from "fixtures/api.fixtures";

test.describe("[API] [Sales Portal] [Orders] [Create]", () => {
  let productID = "";
  let customerID = "";
  let token = "";
  let productData: IProduct;

  test.beforeEach(async ({ loginApiService }) => {
    token = await loginApiService.loginAsAdmin();
  });

  test("Create Order in Draft status", async ({ productsApiService, customerApiService, ordersApi }) => {
    productData = await generateProductData();

    const createdProduct = await productsApiService.create(token, productData);
    productID = createdProduct._id;

    const customerData = await generateCustomerData();
    const customer = await customerApiService.create(token, customerData);
    customerID = await customer._id;

    const orderData = { customer: customerID, products: [productID] };
    const orderResponse = await ordersApi.create(orderData, token);

    console.log(orderResponse.status);
    console.log(orderResponse.body);

    const createdOrder = orderResponse.body.Order;
    await expect(createdOrder.status).toEqual("Draft");
  });
});
