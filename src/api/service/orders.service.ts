import { OrdersApi } from "api/api/orders.api";
import { CustomersApi } from "api/api/customers.api";
import { CustomersApiService } from "./customers.service";
import { ProductsApiService } from "./products.service";
import { validateResponse } from "utils/validation/validateResponse.utils";
import { STATUS_CODES } from "data/statusCode";
import {
  IDeliveryInfo,
  IGetOrdersParams,
  IOrderCreateBody,
  IOrdersResponse,
  ORDER_STATUSES,
  OrdersSortField,
  IOrder,
  IOrderResponse,
} from "data/types/orders.types";
import { createOrderSchema } from "data/schemas/orders/create.schema";
import { generateDeliveryData } from "data/orders/generateDeliveryData";
import { expect } from "fixtures/api.fixtures";
import { convertToDate } from "utils/date.utils";
import { IResponse, SortOrder } from "data/types/core.types";

export class OrdersApiService {
  constructor(
    private ordersApi: OrdersApi,
    private customersApi: CustomersApi,
    private productsApi: ProductsApi,
    private customersApiService: CustomersApiService,
    private productsApiService: ProductsApiService,
  ) {}

  async create(data: IOrderCreateBody, token: string) {
    const response = await this.ordersApi.create(data, token);
    validateResponse(response, {
      status: STATUS_CODES.CREATED,
      IsSuccess: true,
      ErrorMessage: null,
      schema: createOrderSchema,
    });
    return response.body.Order;
  }

  async getOrderById(token: string, id: string) {
    const response = await this.ordersApi.getByID(id, token);
    validateResponse(response, {
      status: STATUS_CODES.OK,
      IsSuccess: true,
      ErrorMessage: null,
      schema: createOrderSchema,
    });
    return response.body.Order;
  }

  async getOrdersList(token: string, params?: Partial<IGetOrdersParams>) {
    const response = await this.ordersApi.getSorted(token, params);
    validateResponse(response, {
      status: STATUS_CODES.OK,
      IsSuccess: true,
      ErrorMessage: null,
    });
    return response.body.Orders;
  }

  async createDraftOrder(token: string, numberOFProducts = 1) {
    // if (numberOFProducts < 1 || numberOFProducts > 5)
    //   throw new Error(`Unable to create Order with ${numberOFProducts} products`);
    const customer = await this.customersApiService.create(token);
    const orderData: IOrderCreateBody = {
      customer: customer._id,
      products: [],
    };
    if (numberOFProducts > 5 || numberOFProducts < 1) {
      throw new Error(`Incorrect number of Products`);
    }
    for (let i = 0; i < numberOFProducts; i++) {
      const product = await this.productsApiService.create(token);
      orderData.products.push(product._id);
    }
    const order = await this.create(orderData, token);
    return order;
  }

  async createDraftOrderWithDelivery(token: string, numberOFProducts = 1) {
    const order = await this.createDraftOrder(token, numberOFProducts);
    const orderWithDelivery = await this.ordersApi.updateDeliveryDetails(order._id, generateDeliveryData(), token);
    validateResponse(orderWithDelivery, {
      status: STATUS_CODES.OK,
      IsSuccess: true,
      ErrorMessage: null,
      schema: createOrderSchema,
    });
    return orderWithDelivery.body.Order;
  }

  async createOrders(token: string, numberOfOrders: number) {
    const orders: IOrder[] = [];
    for (let i = 0; i < numberOfOrders; i++) {
      const order = await this.createDraftOrderWithDelivery(token);
      orders.push(order);
    }
    return orders;
  }

  async createInProsessOrder(token: string, numberOFProducts = 1) {
    const createdOrder = await this.createDraftOrderWithDelivery(token, numberOFProducts);
    const order = await this.ordersApi.updateStatus(
      {
        id: createdOrder._id,
        status: ORDER_STATUSES.IN_PROCESS,
      },
      token,
    );
    return order.body.Order;
  }

  async createCanceledOrder(token: string, numberOFProducts = 1) {
    const createdOrder = await this.createDraftOrderWithDelivery(token, numberOFProducts);
    const order = await this.ordersApi.updateStatus(
      {
        id: createdOrder._id,
        status: ORDER_STATUSES.CANCELED,
      },
      token,
    );
    return order.body.Order;
  }

  async assignManager(orderId: string, managerId: string, token: string) {
    const response = await this.ordersApi.assignManager(orderId, managerId, token);
    validateResponse(response, {
      status: STATUS_CODES.OK,
      IsSuccess: true,
      ErrorMessage: null,
      schema: createOrderSchema,
    });
    return response.body.Order;
  }

  async unassignManager(orderId: string, token: string) {
    const response = await this.ordersApi.unassignManager(orderId, token);
    validateResponse(response, {
      status: STATUS_CODES.OK,
      IsSuccess: true,
      ErrorMessage: null,
      schema: createOrderSchema,
    });
    return response.body.Order;
  }

  async deleteOrder(id: string, token: string) {
    const response = await this.ordersApi.delete(id, token);
    validateResponse(response, {
      status: STATUS_CODES.DELETED,
    });
  }

  async deleteOrderWithCustomerAndProduct(idOrOrder: string | IOrder, token: string) {
    const createdOrder =
      typeof idOrOrder === "string" ? (await this.ordersApi.getByID(idOrOrder, token)).body.Order : idOrOrder;
    const orderId = createdOrder._id;
    const customerId = createdOrder.customer._id;
    const productsIds = createdOrder.products.map((product) => product._id);
    const uniqueProductsIds = [...new Set(productsIds)];

    //delete order
    const orderDeleteResponse = await this.ordersApi.delete(orderId, token);
    expect.soft(orderDeleteResponse.status).toBe(STATUS_CODES.DELETED);

    //delete customer
    const responseCustomer = await this.customersApi.delete(customerId, token);
    expect.soft(responseCustomer.status).toBe(STATUS_CODES.DELETED);

    //delete products
    const responsesProducts = await Promise.all(uniqueProductsIds.map((id) => this.productsApi.delete(id, token)));
    responsesProducts.forEach((response) => expect.soft(response.status).toBe(STATUS_CODES.DELETED));
  }

  async addOrderComment(id: string, token: string, comment?: string) {
    if (!comment) {
      comment = "Default comment text";
    }
    const response = await this.ordersApi.addComment(id, comment, token);
    validateResponse(response, {
      status: STATUS_CODES.OK,
      IsSuccess: true,
      ErrorMessage: null,
    });
    return response.body.Order;
  }

  async getCommentIDByText(orderId: string, commentText: string, token: string) {
    const orderInfo = await this.ordersApi.getByID(orderId, token);
    const correctComment = orderInfo.body.Order.comments.find((c: { text: string }) => c.text === commentText);
    return correctComment?._id;
  }

  async assertCommentIsDeleted(orderId: string, commentID: string, token: string) {
    const orderInfo = await this.ordersApi.getByID(orderId, token);
    const orderComments = orderInfo.body.Order.comments!;
    expect(orderComments.find((c) => c._id === commentID)).toBeFalsy();
  }

  async assertOrderInList(
    response: IResponse<IOrdersResponse>,
    order: IOrder,
    withStatuses?: ORDER_STATUSES | ORDER_STATUSES[],
  ) {
    validateResponse(response, {
      status: STATUS_CODES.OK,
      IsSuccess: true,
    });
    const found = response.body.Orders.find((el) => el._id === order._id);
    expect.soft(found, "Created order should be in response").toBeTruthy();
    if (withStatuses) {
      const allowedStatuses = Array.isArray(withStatuses) ? withStatuses : [withStatuses];
      const onlyAllowed = response.body.Orders.every((item) => allowedStatuses.includes(item.status));
      expect.soft(onlyAllowed, `All orders should have status in ${allowedStatuses.join(", ")}`).toBe(true);
    }
  }

  async assertOrdersInList(
    response: IResponse<IOrdersResponse>,
    orders: IOrder[],
    withStatuses?: ORDER_STATUSES | ORDER_STATUSES[],
  ) {
    for (const order of orders) {
      await this.assertOrderInList(response, order, withStatuses);
    }
  }

  async assertSortedResponseMeta(
    response: IResponse<IOrdersResponse>,
    sortField: OrdersSortField,
    sortOrder: SortOrder,
    expectedLimit: number,
    minTotal = 1,
  ) {
    validateResponse(response, {
      status: STATUS_CODES.OK,
      IsSuccess: true,
    });
    const { limit, search, status, total, page, sorting } = response.body;
    expect.soft(limit, `Limit should be ${expectedLimit}`).toBe(expectedLimit);
    expect.soft(search).toBe("");
    expect.soft(status).toEqual([]);
    expect.soft(page).toBe(1);
    expect.soft(sorting).toEqual({ sortField, sortOrder });
    expect.soft(total).toBeGreaterThanOrEqual(minTotal);
  }

  assertDeliveryDetailsAreEdited(expectedDelivery: IDeliveryInfo, actualDelivery: IDeliveryInfo) {
    expect(actualDelivery.address).toEqual(expectedDelivery.address);
    expect(convertToDate(actualDelivery.finalDate)).toEqual(expectedDelivery.finalDate);
    expect(actualDelivery.condition).toEqual(expectedDelivery.condition);
  }

  async assertOrderRelatedDataLoaded(response: IResponse<IOrderResponse>, commentText?: string) {
    const { customer, products, delivery, comments, history } = response.body.Order;
    expect.soft(customer).toBeTruthy();
    expect.soft(products.length).toBeGreaterThan(0);
    expect.soft(delivery).not.toBeNull();
    expect.soft(comments.length).toBeGreaterThan(0);
    expect.soft(history.length).toBeGreaterThan(0);
    if (commentText) {
      expect.soft(comments.some((c) => c.text === commentText)).toBe(true);
    }
  }

  async assertOrderStatus(response: IResponse<IOrderResponse>, expectedStatus: string) {
    expect.soft(response.body.Order.status).toEqual(expectedStatus);
  }

  calculateProductsTotalPrice(products: IOrder["products"]): number {
    return products.reduce((total, product) => total + Number(product.price), 0);
  }

  async deleteOrderWithCustomerAndProduct(idOrOrder: string | IOrder, token: string) {
    const createdOrder =
      typeof idOrOrder === "string" ? (await this.ordersApi.getByID(idOrOrder, token)).body.Order : idOrOrder;
    const orderId = createdOrder._id;
    const customerId = createdOrder.customer._id;
    const productIds = [...new Set(createdOrder.products.map((product) => product._id))];

    await this.deleteOrder(orderId, token);
    await this.customersApiService.delete(token, customerId);
    for (const productId of productIds) {
      await this.productsApiService.delete(token, productId);
    }
  }
}
