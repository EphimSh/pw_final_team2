import { generateManagerData } from "data/manager/generateManagerData";
import { expect, test } from "fixtures/api.fixtures";

test.describe("[API] [Sales Portal] [Orders] [Manager]", () => {
  let token = "";
  let orderId = "";
  let managerId = "";

  test.beforeEach(async ({ loginApiService }) => {
    token = await loginApiService.loginAsAdmin();
  });

  test.afterEach(async ({ ordersApiService, usersApiService }) => {
    if (orderId) await ordersApiService.deleteOrder(orderId, token);
    if (managerId) await usersApiService.delete(token, managerId);
    orderId = "";
    managerId = "";
  });

  test("SC-091: Successful manager assignment", async ({ ordersApiService, usersApiService }) => {
    const managerData = generateManagerData();
    const manager = await usersApiService.create(token, managerData);
    managerId = manager._id;

    const order = await ordersApiService.createDraftOrder(token);
    orderId = order._id;

    const response = await ordersApiService.assignManager(orderId, managerId, token);
    //TODO: implement assert method
    expect(response.assignedManager).toBeTruthy();
    expect(response.assignedManager!._id).toBe(managerId);
    expect(response.assignedManager!.username).toBe(manager.username);
  });

  test("SC-097: Successful manager unassignment", async ({ ordersApiService, usersApiService }) => {
    const managerData = generateManagerData();
    const manager = await usersApiService.create(token, managerData);
    managerId = manager._id;
    const order = await ordersApiService.createDraftOrder(token);
    orderId = order._id;
    await ordersApiService.assignManager(orderId, managerId, token);

    const response = await ordersApiService.unassignManager(orderId, token);
    //TODO: implement assert method
    expect(response.assignedManager).toBeNull();
  });
});
