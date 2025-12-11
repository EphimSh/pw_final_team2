import { OrdersApi } from "api/api/orders.api";
import { CustomersApiService } from "./customers.service";
import { ProductsApiService } from "./products.service";
import { IOrderCreateBody } from "data/types/orders.types";
import { validateResponse } from "utils/validation/validateResponse.utils";
import { STATUS_CODES } from "data/statusCode";
import { createOrderSchema } from "data/schemas/orders/create.schema";

export class OrdersApiService {
  constructor(
    private ordersApi: OrdersApi,
    private customersApiService: CustomersApiService,
    private productsApiService: ProductsApiService,
  ) {}

  async create(token: string, customerId: string, productIds: string[]) {
    const customer = await this.customersApiService.getById(customerId, token);
    const customerIdFromResponse = await customer._id;

    if (!productIds || productIds.length === 0) {
      throw new Error("At least one product ID is required to create an order");
    }

    const productIdsFromResponse: string[] = [];
    for (const productId of productIds) {
      const product = await this.productsApiService.getById(productId, token);
      productIdsFromResponse.push(product._id);
    }

    const orderData: IOrderCreateBody = {
      customer: customerIdFromResponse,
      products: productIdsFromResponse,
    };

    const response = await this.ordersApi.create(orderData, token);

    validateResponse(response, {
      status: STATUS_CODES.CREATED,
      IsSuccess: true,
      ErrorMessage: null,
      schema: createOrderSchema,
    });

    return response.body.Order;
  }
}
