import { OrdersApi } from "api/api/orders.api";
import { CustomersApiService } from "./customers.service";
import { ProductsApiService } from "./products.service";
import { validateResponse } from "utils/validation/validateResponse.utils";
import { STATUS_CODES } from "data/statusCode";
import { IOrderCreateBody, ORDER_STATUSES } from "data/types/orders.types";
import { createOrderSchema } from "data/schemas/orders/create.schema";
import { generateDelivery } from "data/orders/delivery";

export class OrdersApiService {
  constructor(
    private ordersApi: OrdersApi,
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

  async createDraftOrder(token: string, numberOFProducts = 1) {
    if (numberOFProducts < 1 || numberOFProducts > 5)
      throw new Error(`Unable to create Order with ${numberOFProducts} products`);
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
    const orderWithDelivery = await this.ordersApi.updateDelivery(order._id, generateDelivery(), token);
    validateResponse(orderWithDelivery, {
      status: STATUS_CODES.OK,
      IsSuccess: true,
      ErrorMessage: null,
      schema: createOrderSchema,
    });
    return orderWithDelivery.body.Order;
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
}
