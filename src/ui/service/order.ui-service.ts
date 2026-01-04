import { expect, Locator, Page } from "@playwright/test";
import { NOTIFICATIONS } from "data/notifications/notifications";
import { ORDER_STATUSES } from "data/types/orders.types";
import { OrderPage } from "ui/pages/orders/order.page";
import { logStep } from "utils/report/logStep.utils";

export class OrderUIService {
  orderPage: OrderPage;
  readonly removeAssignedManagerButton: Locator;
  readonly submitButton: Locator;
  readonly saveManagerButton: Locator;

  constructor(private page: Page) {
    this.orderPage = new OrderPage(page);
    this.removeAssignedManagerButton = this.page.getByTitle("Remove Assigned Manager");
    this.submitButton = this.page.locator("[type='submit']");
    this.saveManagerButton = this.page.locator("#update-manager-btn");
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

  @logStep("Click Select Manager link on Order Details page")
  async clickSelectManagerLink() {
    await this.orderPage.clickSelectManagerLink();
  }

  @logStep("Click manager by name on Order Details page")
  async clickManagerByName(name: string) {
    await this.orderPage.clickManagerByName(name);
  }

  @logStep("Select manager by name on Order Details page")
  async selectManagerByName(name: string) {
    await this.orderPage.fillManagerSearch(name);
    await this.orderPage.clickManagerByName(name);
  }

  @logStep("Click Save button")
  async clickSavebutton() {
    await this.saveManagerButton.click();
  }

  @logStep("Click Remove Assigned Manager button on Order Details page")
  async clickRemoveAssignedManager() {
    await this.removeAssignedManagerButton.click();
  }

  @logStep("Click Submit button")
  async clickSubmitbutton() {
    await this.submitButton.click();
  }

  async clickSubmitButton() {
    await this.clickSubmitbutton();
  }

  @logStep("Assign manager by name on Order Details page")
  async assignManager(managerName: string) {
    await this.openManagerModalByEditButton();
    await this.selectManagerByName(managerName);
    await this.clickSavebutton();
  }

  @logStep("Unassign manager by name on Order Details page")
  async removeManager() {
    await this.clickRemoveAssignedManager();
    await this.clickSubmitButton();
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
