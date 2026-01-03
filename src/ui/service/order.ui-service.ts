import { expect, Locator, Page } from "@playwright/test";
import { NOTIFICATIONS } from "data/notifications/notifications";
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

  @logStep("Add cooment on Order Details page")
  async addComment(comment: string) {
    await this.orderPage.fillCommentArea(comment);
    await this.orderPage.clickSaveCommentButton();
    await expect(this.orderPage.commentContainer).toBeVisible();
    await expect(this.orderPage.comment).toHaveText(comment);
    await expect(this.orderPage.toastMessage).toContainText(NOTIFICATIONS.COMMENT_ADDED);
    await this.orderPage.closeToastMessage();
  }

  @logStep("Remove comment on Order Details page")
  async removeComment(comment: string) {
    await this.addComment(comment);
    await this.orderPage.clickRemoveCommentButton();
    await expect(this.orderPage.commentContainer).not.toBeVisible();
    await expect(this.orderPage.toastMessage).toContainText(NOTIFICATIONS.COMMENT_DELETED);
    await this.orderPage.closeToastMessage();
  }
}
