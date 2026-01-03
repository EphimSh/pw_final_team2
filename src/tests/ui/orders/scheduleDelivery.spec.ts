import { generateDeliveryData } from "data/orders/generateDeliveryData";
import { DELIVERY_CONDITIONS, IOrderProduct } from "data/types/orders.types";
import { expect, test } from "fixtures";

test.describe("[UI] [Sales Portal] [Orders] [Shedule Delivery]", () => {
  let token = "";
  let orderID = "";
  let customerId = "";
  let productsList: IOrderProduct[] = [];

  test.beforeEach(async ({ loginUIService }) => {
    token = await loginUIService.loginAsAdmin();
  });

  test.afterEach(async ({ ordersApiService, customerApiService, productsApiService }) => {
    if (orderID) await ordersApiService.deleteOrder(orderID, token);
    if (customerId) await customerApiService.delete(token, customerId);
    if (productsList) {
      for (const product of productsList) {
        await productsApiService.delete(token, product._id);
      }
    }
  });

  test("Fill delivery info", async ({ ordersApiService, orderPage, orderUIService, scheduleDeliveryPage }) => {
    const order = await ordersApiService.createDraftOrder(token);
    orderID = order._id;
    customerId = order.customer._id;
    productsList = order.products;

    await orderUIService.openOrderById(orderID);
    await orderPage.openSheduleDeliveryPage();
    await scheduleDeliveryPage.waitForOpened();

    await scheduleDeliveryPage.selectLocation("Other");
    await scheduleDeliveryPage.fillForm({ finalDate: "2026/01/02" });
    await scheduleDeliveryPage.fillForm({ address: { city: "Rezina" } });
    await scheduleDeliveryPage.fillForm({ address: { flat: 777 } });
    await expect(scheduleDeliveryPage.saveDeliveryButton).toBeEnabled();
    await scheduleDeliveryPage.clickSave();

    await orderPage.clickDeliveryTab();
    const deliveryData = await orderPage.getDeliveryData();

    console.log(deliveryData);
  });

  test("Fill delivery info", async ({ ordersApiService, orderPage, orderUIService, scheduleDeliveryPage }) => {
    const order = await ordersApiService.createDraftOrder(token);
    orderID = order._id;
    customerId = order.customer._id;
    productsList = order.products;

    await orderUIService.openOrderById(orderID);
    await orderPage.openSheduleDeliveryPage();
    await scheduleDeliveryPage.waitForOpened();

    await scheduleDeliveryPage.selectLocation("Other");
    await scheduleDeliveryPage.fillForm({ finalDate: "2026/01/02" });
    await scheduleDeliveryPage.fillForm({ address: { city: "Rezina" } });
    await scheduleDeliveryPage.fillForm({ address: { flat: 777 } });
    await expect(scheduleDeliveryPage.saveDeliveryButton).toBeEnabled();
    await scheduleDeliveryPage.clickSave();

    await orderPage.clickDeliveryTab();
    const deliveryData = await orderPage.getDeliveryData();

    console.log(deliveryData);
  });

  // "create delivery with Customer Home address" // "Done"
  // "create delivery with Other address entierly" // Done
  // "create delivery with new address partially"
  // "create pickup in same country as Customer"
  // "create pickup in different country than Customer"
  // "Check delivery address is same as Customers address"

  test("Create delivery with Customer Home address", async ({
    ordersApiService,
    orderPage,
    orderUIService,
    scheduleDeliveryPage,
  }) => {
    const order = await ordersApiService.createDraftOrder(token);
    orderID = order._id;
    customerId = order.customer._id;
    const customer = order.customer;
    productsList = order.products;

    await orderUIService.openOrderById(orderID);
    await orderPage.openSheduleDeliveryPage();
    await scheduleDeliveryPage.waitForOpened();

    await scheduleDeliveryPage.selectLocation("Home");
    //await scheduleDeliveryPage.fillForm({ finalDate: generateDeliveryDate() });
    await scheduleDeliveryPage.clickSave();

    await orderPage.clickDeliveryTab();
    const deliveryAddress = await orderPage.getDeliveryAddress();

    const customerAddress = orderPage.getCustomerAddress(customer);

    expect(customerAddress).toEqual(deliveryAddress);
  });

  test("Create delivery with Other address different from Customer address", async ({
    ordersApiService,
    orderPage,
    orderUIService,
    scheduleDeliveryPage,
  }) => {
    const order = await ordersApiService.createDraftOrder(token);
    orderID = order._id;
    customerId = order.customer._id;
    const customer = order.customer;
    productsList = order.products;

    await orderUIService.openOrderById(orderID);
    await orderPage.openSheduleDeliveryPage();
    await scheduleDeliveryPage.waitForOpened();

    const deliveryData = generateDeliveryData({ condition: DELIVERY_CONDITIONS.DELIVERY });

    await scheduleDeliveryPage.fillForm(deliveryData);
    await scheduleDeliveryPage.clickSave();

    await orderPage.clickDeliveryTab();

    const deliveryAddress = await orderPage.getDeliveryAddress();
    const customerAddress = orderPage.getCustomerAddress(customer);

    expect(customerAddress).toEqual(deliveryAddress);
  });

  // test("Check delivery address is same as Customers address", async ({
  //   ordersApiService,
  // }) => {
  //   const order = await ordersApiService.createDraftOrder(token);
  //   orderID = order._id;

  // });

  //  test("delete all customers", async ({
  //   customerApiService
  // }) => {
  //   const allCustomers = await customerApiService.getAll(token);
  //   const customersIds = await allCustomers.map(customer => customer._id);

  //   await customerApiService.deleteAllCustomers(customersIds, token);

  //   // for(const customer of allCustomers){
  //   //   await customerApiService.deleteAllCustomers
  //   // }
  // });

  // test("delete all products", async ({
  //   productsApiService
  // }) => {
  //   const allProducts = await productsApiService.getAll(token);
  //   const productIds = allProducts.map(product => product._id);

  //   for(const id of productIds){
  //     await productsApiService.delete(token, id);
  //   }
  // });
});
