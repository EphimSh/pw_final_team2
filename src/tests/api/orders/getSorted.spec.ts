import { generateDeliveryData } from "data/orders/generateDeliveryData";
import { ORDER_STATUSES } from "data/types/orders.types";
import { test } from "fixtures/api.fixtures";

test.describe("[API] [Sales Portal] [Orders] [Get Sorted]", () => {
  let token = "";
  const orderIds: string[] = [];

  test.beforeAll(async ({ loginApiService }) => {
    token = await loginApiService.loginAsAdmin();
  });

  test.afterEach(async ({ ordersApiService }) => {
    if (!orderIds.length) return;
    for (const id of orderIds) {
      await ordersApiService.deleteOrderWithCustomerAndProduct(id, token);
    }
    orderIds.length = 0;
  });

  test("SC-064: Get orders without parameters", async ({ ordersApiService, ordersApi }) => {
    const order = await ordersApiService.createDraftOrder(token);
    orderIds.push(order._id);

    const response = await ordersApi.getSorted(token);
    await ordersApiService.assertOrderInList(response, order);
  });

  test("SC-065: Search order by customer name", async ({ ordersApiService, ordersApi, customerApiService }) => {
    const order = await ordersApiService.createDraftOrder(token);
    orderIds.push(order._id);
    await customerApiService.update(order.customer._id, token, { name: "Ivan Ivanov" });

    const response = await ordersApi.getSorted(token, { search: "Ivan" });

    await ordersApiService.assertOrderInList(response, order);
  });

  test("SC-066: Search order by customer email", async ({ ordersApiService, ordersApi, customerApiService }) => {
    const order = await ordersApiService.createDraftOrder(token);
    orderIds.push(order._id);
    const email = `test-${Date.now()}@example.com`;
    await customerApiService.update(order.customer._id, token, { email });

    const response = await ordersApi.getSorted(token, { search: email });

    await ordersApiService.assertOrderInList(response, order);
  });

  test("SC-067: Filter by single status", async ({ ordersApiService, ordersApi }) => {
    const order = await ordersApiService.createDraftOrder(token);
    const inProcessOrder = await ordersApiService.createInProsessOrder(token);
    orderIds.push(order._id, inProcessOrder._id);

    const response = await ordersApi.getSorted(token, { status: [ORDER_STATUSES.DRAFT] });

    await ordersApiService.assertOrderInList(response, order, ORDER_STATUSES.DRAFT);
  });

  test("SC-068: Filter by multiple statuses", async ({ ordersApiService, ordersApi }) => {
    const order = await ordersApiService.createDraftOrder(token);
    const inProcessOrder = await ordersApiService.createInProsessOrder(token);
    orderIds.push(order._id, inProcessOrder._id);

    const response = await ordersApi.getSorted(token, {
      status: [ORDER_STATUSES.DRAFT, ORDER_STATUSES.IN_PROCESS],
    });

    await ordersApiService.assertOrderInList(response, order, [ORDER_STATUSES.DRAFT, ORDER_STATUSES.IN_PROCESS]);
  });

  test("SC-069: Sort by creation date (ascending)", async ({ ordersApiService, ordersApi }) => {
    const createOrders = await ordersApiService.createOrders(token, 3);
    orderIds.push(...createOrders.map((order) => order._id));
    const response = await ordersApi.getSorted(token, { sortField: "createdOn", sortOrder: "asc" });
    await ordersApiService.assertSortedResponseMeta(response, "createdOn", "asc", 10);
  });

  test("SC-070: Sort by total price (descending)", async ({ ordersApiService, ordersApi }) => {
    const createOrders = await ordersApiService.createOrders(token, 3);
    orderIds.push(...createOrders.map((order) => order._id));
    const response = await ordersApi.getSorted(token, { sortField: "price", sortOrder: "desc" });
    await ordersApiService.assertSortedResponseMeta(response, "price", "desc", 10);
  });

  test("SC-071: Combined filter: status + search", async ({ ordersApiService, ordersApi, customerApiService }) => {
    const order = await ordersApiService.createDraftOrder(token);
    orderIds.push(order._id);
    await customerApiService.update(order.customer._id, token, { name: "Ivan Ivanov" });
    await ordersApi.updateDeliveryDetails(order._id, generateDeliveryData(), token);
    await ordersApi.updateStatus({ id: order._id, status: ORDER_STATUSES.IN_PROCESS }, token);

    const response = await ordersApi.getSorted(token, {
      status: [ORDER_STATUSES.IN_PROCESS],
      search: "Ivan",
    });

    await ordersApiService.assertOrderInList(response, order, ORDER_STATUSES.IN_PROCESS);
  });

  //TODO: sc 072,073
});
