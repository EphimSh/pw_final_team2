import { expect, Locator, Page } from "@playwright/test";
import { ORDER_STATUSES } from "data/types/orders.types";
import { OrderPage } from "ui/pages/orders/order.page";
import { logStep } from "utils/report/logStep.utils";

export class OrderUIService {
  orderPage: OrderPage;

  constructor(private page: Page) {
    this.orderPage = new OrderPage(page);
  }

  @logStep("Open Order Details page by id")
  async openOrderById(orderId: string) {
    await this.orderPage.open(`orders/${orderId}`);
    await this.orderPage.waitForOpened();
  }

  @logStep("Assert order status on Order Details page")
  async assertStatus(statusLocator: Locator, expectedStatus: ORDER_STATUSES) {
    await expect.soft(statusLocator).toHaveText(expectedStatus);
  }

  @logStep("Open Edit Assigned Manager modal via pencil button")
  async openManagerModalByEditButton() {
    await this.orderPage.clickEditAssignedManager();
    await expect(this.orderPage.assignManagerModalContainer).toBeVisible();
  }

  @logStep("Open Edit Assigned Manager modal via select link")
  async openManagerModalByLink() {
    await this.orderPage.clickSelectManagerLink();
    await expect(this.orderPage.assignManagerModalContainer).toBeVisible();
  }

  @logStep("Select manager by name on Order Details page")
  async selectManagerByName(name: string) {
    await this.orderPage.fillManagerSearch(name);
    await this.orderPage.clickManagerByName(name);
  }
}
