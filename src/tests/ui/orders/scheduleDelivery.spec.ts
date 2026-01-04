import { deliveryAddress } from "data/orders/deliveryAddress.ddt";
import { generateDeliveryData, generateDeliveryDate } from "data/orders/generateDeliveryData";
import { COUNTRIES } from "data/types/countries";
import { ICustomerFromResponse } from "data/types/customers.types";
import { DELIVERY_CONDITIONS, IDeliveryAddress } from "data/types/orders.types";
import { expect, test } from "fixtures";
import { getRandomEnumValue } from "utils/enum.utils";

test.describe("[UI] [Sales Portal] [Orders] [Shedule Delivery]", () => {
  let token = "";
  let orderID = "";
  let customer: ICustomerFromResponse;

  test.beforeEach(async ({ loginApiService, ordersApiService }) => {
    token = await loginApiService.loginAsAdmin();
    const order = await ordersApiService.createDraftOrder(token);
    orderID = order._id;
    customer = order.customer;
  });

  test.afterEach(async ({ ordersApiService }) => {
    if (orderID) await ordersApiService.deleteOrderWithCustomerAndProduct(orderID, token);
  });

  test("Create delivery with Customer Home address", async ({ orderPage, orderUIService, scheduleDeliveryPage }) => {
    await orderUIService.openOrderById(orderID);
    await orderPage.openSheduleDeliveryPage();
    await scheduleDeliveryPage.waitForOpened();

    await scheduleDeliveryPage.selectLocation("Home");
    await scheduleDeliveryPage.fillForm({ finalDate: generateDeliveryDate() });
    await scheduleDeliveryPage.clickSave();

    await orderPage.clickDeliveryTab();
    const deliveryAddress = await orderPage.getDeliveryAddress();

    const customerAddress = await orderPage.getCustomerAddress(customer);

    expect(customerAddress).toEqual(deliveryAddress);
  });

  test("Create delivery with Other address entierly different from Customer address", async ({
    orderPage,
    orderUIService,
    scheduleDeliveryPage,
  }) => {
    await orderUIService.openOrderById(orderID);
    await orderPage.openSheduleDeliveryPage();
    await scheduleDeliveryPage.waitForOpened();

    const deliveryData = generateDeliveryData({ condition: DELIVERY_CONDITIONS.DELIVERY });
    const generatedDeliveryAddress = deliveryData.address;

    await scheduleDeliveryPage.fillForm(deliveryData);
    await scheduleDeliveryPage.clickSave();

    await orderPage.clickDeliveryTab();
    const deliveryAddressFromUI = await orderPage.getDeliveryAddress();
    const customerAddress = orderPage.getCustomerAddress(customer);

    expect(customerAddress).not.toEqual(deliveryAddressFromUI);
    expect(generatedDeliveryAddress).toEqual(deliveryAddressFromUI);
  });

  test.describe("[Partially modify customer delivery address on Shedule Delivery page]", () => {
    for (const addressScenarios of deliveryAddress) {
      test(`${addressScenarios.title}`, async ({ orderPage, orderUIService, scheduleDeliveryPage }) => {
        await orderUIService.openOrderById(orderID);
        await orderPage.openSheduleDeliveryPage();
        await scheduleDeliveryPage.waitForOpened();

        const deliveryDate = generateDeliveryDate();
        await scheduleDeliveryPage.fillForm({
          condition: DELIVERY_CONDITIONS.DELIVERY,
          address: addressScenarios.address as Partial<IDeliveryAddress>,
          finalDate: deliveryDate,
        });
        await scheduleDeliveryPage.clickSave();

        await orderPage.clickDeliveryTab();
        const deliveryAddressFromUI = await orderPage.getDeliveryAddress();
        console.log(deliveryAddressFromUI);
        const customerAddress = await orderPage.getCustomerAddress(customer);
        const modifiedField = addressScenarios.modifiedField as keyof IDeliveryAddress;

        expect(customerAddress).not.toEqual(deliveryAddressFromUI);
        expect(deliveryAddressFromUI[modifiedField]).toEqual(
          (addressScenarios.address as Partial<IDeliveryAddress>)[modifiedField],
        );
      });
    }
  });

  // "create pickup in same country as Customer"

  test("Create pickup in same country as Customer", async ({ orderPage, orderUIService, scheduleDeliveryPage }) => {
    await orderUIService.openOrderById(orderID);
    await orderPage.openSheduleDeliveryPage();
    await scheduleDeliveryPage.waitForOpened();

    const customerAddress = orderPage.getCustomerAddress(customer);
    await scheduleDeliveryPage.choosePickUpDelivery();
    await scheduleDeliveryPage.setDeliveryDate();
    await scheduleDeliveryPage.clickSave();

    await orderPage.clickDeliveryTab();
    const pickUpAddressFromUI = await orderPage.getDeliveryAddress();

    expect(customerAddress).not.toEqual(pickUpAddressFromUI);
    expect(pickUpAddressFromUI.country).toEqual((await customerAddress).country);
  });

  test("Create pickup in different country than Customer", async ({
    orderPage,
    orderUIService,
    scheduleDeliveryPage,
  }) => {
    await orderUIService.openOrderById(orderID);
    await orderPage.openSheduleDeliveryPage();
    await scheduleDeliveryPage.waitForOpened();

    const pickUpCountry = getRandomEnumValue(COUNTRIES);
    await scheduleDeliveryPage.choosePickUpDelivery(pickUpCountry);
    await scheduleDeliveryPage.setDeliveryDate();
    await scheduleDeliveryPage.clickSave();

    await orderPage.clickDeliveryTab();
    const pickUpAddressFromUI = await orderPage.getDeliveryAddress();
    const customerAddress = orderPage.getCustomerAddress(customer);

    expect(customerAddress).not.toEqual(pickUpAddressFromUI);
    expect(pickUpAddressFromUI.country).toEqual(pickUpCountry);
  });
});
