import { expect, Page } from "@playwright/test";
import { apiConfig } from "config/apiConfig";
import { STATUS_CODES } from "data/statusCode";
import { IOrderCreateBody, IOrderResponse } from "data/types/orders.types";
import { AddNewOrderPage, OrdersListPage } from "ui/pages/orders";
import { logStep } from "utils/report/logStep.utils";

export class AddNewOrderUIService {
  addNewOrderPage: AddNewOrderPage;
  ordersListPage: OrdersListPage;

  constructor(private page: Page) {
    this.addNewOrderPage = new AddNewOrderPage(page);
    this.ordersListPage = new OrdersListPage(page);
  }

  @logStep("Open Create Order modal")
  async open() {
    await this.ordersListPage.open("orders");
    await this.ordersListPage.waitForOpened();
    await this.ordersListPage.clickAddNewOrder();
    await this.addNewOrderPage.waitForOpened();
  }

  @logStep("Create new order via UI")
  async create(orderData: Partial<IOrderCreateBody> = {}) {
    await this.addNewOrderPage.fillForm(orderData);
    const response = await this.addNewOrderPage.interceptResponse<IOrderResponse, []>(
      apiConfig.endpoints.orders,
      this.addNewOrderPage.clickCreate.bind(this.addNewOrderPage),
    );
    expect(response.status).toBe(STATUS_CODES.CREATED);
    await this.ordersListPage.waitForOpened();
    return response.body.Order;
  }
}
