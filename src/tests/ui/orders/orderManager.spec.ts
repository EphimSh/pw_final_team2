import { NOTIFICATIONS } from "data/notifications/notifications";
import { generateManagerData } from "data/manager/generateManagerData";
import { TEST_TAG, COMPONENT_TAG } from "data/types/tags.types";
import { test, expect } from "fixtures";

test.describe("[UI] [Sales Portal] [Orders] [Manager]", () => {
  let token = "";
  let orderId = "";
  let managerIds: string[] = [];

  test.beforeEach(async ({ loginApiService }) => {
    token = await loginApiService.loginAsAdmin();
  });

  test.afterEach(async ({ ordersApiService, usersApiService }) => {
    if (orderId) await ordersApiService.deleteOrderWithCustomerAndProduct(orderId, token);
    for (const id of managerIds) {
      await usersApiService.delete(token, id);
    }
    orderId = "";
    managerIds = [];
  });

  test.skip(
    "SC-091: Successful manager assignment",
    { tag: [TEST_TAG.REGRESSION, TEST_TAG.UI, TEST_TAG.POSITIVE, COMPONENT_TAG.ORDERS, COMPONENT_TAG.MANAGERS] },
    async ({ orderUIService, loginUIService, usersApiService, ordersApiService }) => {
      const managerData = generateManagerData();
      const manager = await usersApiService.create(token, managerData);
      managerIds.push(manager._id);
      const order = await ordersApiService.createDraftOrder(token);
      orderId = order._id;

      await loginUIService.loginAsAdmin();
      await orderUIService.openOrderById(orderId);
      await orderUIService.openManagerModalByLink();
      await orderUIService.selectManagerByName(manager.firstName);
      await orderUIService.clickSavebutton();
      await expect(orderUIService.orderPage.toastMessage).toContainText(NOTIFICATIONS.MANAGER_FOR_ORDER_ASSIGNED);
      await orderUIService.orderPage.closeToastMessage();
    },
  );

  test.skip(
    "SC-091: Successful manager change",
    { tag: [TEST_TAG.REGRESSION, TEST_TAG.UI, TEST_TAG.POSITIVE, COMPONENT_TAG.ORDERS, COMPONENT_TAG.MANAGERS] },
    async ({ orderUIService, usersApiService, loginUIService, ordersApiService }) => {
      const firstManager = await usersApiService.create(token, generateManagerData());
      const secondManager = await usersApiService.create(token, generateManagerData());
      managerIds.push(firstManager._id, secondManager._id);
      const order = await ordersApiService.createDraftOrder(token);
      orderId = order._id;
      await ordersApiService.assignManager(orderId, firstManager._id, token);

      await loginUIService.loginAsAdmin();
      await orderUIService.openOrderById(orderId);
      await orderUIService.assignManager(secondManager.firstName);
      await expect(orderUIService.orderPage.toastMessage).toContainText(NOTIFICATIONS.MANAGER_FOR_ORDER_ASSIGNED);
      await orderUIService.orderPage.closeToastMessage();
    },
  );

  test.skip(
    "SC-097: Successful manager unassignment",
    { tag: [TEST_TAG.REGRESSION, TEST_TAG.UI, TEST_TAG.POSITIVE, COMPONENT_TAG.ORDERS, COMPONENT_TAG.MANAGERS] },
    async ({ orderUIService, loginUIService, usersApiService, ordersApiService }) => {
      const manager = await usersApiService.create(token, generateManagerData());
      managerIds.push(manager._id);
      const order = await ordersApiService.createDraftOrder(token);
      orderId = order._id;
      await ordersApiService.assignManager(orderId, manager._id, token);

      await loginUIService.loginAsAdmin();
      await orderUIService.openOrderById(orderId);
      await orderUIService.removeManager();
      await expect(orderUIService.orderPage.toastMessage).toContainText(NOTIFICATIONS.MANAGER_FOR_ORDER_UNASSIGNED);
      await orderUIService.orderPage.closeToastMessage();
    },
  );
});
