import { expect } from "fixtures";
import { SalesPortalPage } from "../salesPortal.page";
import { logStep } from "utils/report/logStep.utils";
import { ICustomerFromResponse } from "data/types/customers.types";
import { DELIVERY_CONDITIONS, IDeliveryAddress, IDeliveryInfo } from "data/types/orders.types";
import _ from "lodash";

export class OrderPage extends SalesPortalPage {
  readonly title = this.page.locator("#order-details-header h2.fw-bold");
  readonly orderStatusValue = this.page.locator("#order-status-bar-container > div").first().locator("span").nth(1);
  readonly assignedManagerContainer = this.page.locator("#assigned-manager-container");
  readonly editAssignedManagerButton = this.page.getByTitle("Edit Assigned Manager");
  readonly selectManagerLink = this.assignedManagerContainer.locator("u");
  readonly assignManagerModalContainer = this.page.locator("#assign-manager-modal-container");
  readonly managerSearchInput = this.page.locator("#manager-search-input");
  readonly managerList = this.page.locator("#manager-list");
  readonly managerItemByName = (name: string) => this.managerList.locator("li", { hasText: name }).first();
  readonly commentArea = this.page.locator("#textareaComments");
  readonly saveCommentButton = this.page.locator("#create-comment-btn");
  readonly commentContainer = this.page.locator(".mx-3");
  readonly comment = this.commentContainer.locator("p");
  readonly removeCommentButton = this.commentContainer.locator('[name="delete-comment"]');

  readonly deliveryTab = this.page.locator("#delivery-tab");
  readonly tabContent = this.page.locator("#order-details-tabs-content");
  readonly scheduleDeliveryButton = this.page.locator("#delivery-btn");
  readonly deliveryInfo = this.page.locator("div #delivery");
  readonly deliveryValues = this.deliveryInfo.locator("div.c-details span.s-span:last-child");

  readonly uniqueElement = this.title;

  @logStep("Fill manager search input on Edit Assigned Manager modal")
  async fillManagerSearch(text: string) {
    await this.managerSearchInput.fill(text);
  }

  @logStep("Click Edit Assigned Manager button on Order Details page")
  async clickEditAssignedManager() {
    await this.editAssignedManagerButton.click();
  }

  @logStep("Click Select Manager link on Order Details page")
  async clickSelectManagerLink() {
    await this.selectManagerLink.click();
  }

  @logStep("Select manager by name on Edit Assigned Manager modal")
  async clickManagerByName(name: string) {
    await this.managerItemByName(name).click();
  }

  @logStep("Fill comment area on Order Details page")
  async fillCommentArea(comment: string) {
    await this.commentArea.fill(comment);
  }

  @logStep("Click Save Comment button on Order Details page")
  async clickSaveCommentButton() {
    await this.saveCommentButton.click();
  }

  @logStep("Click Remove Comment button from Order Details page")
  async clickRemoveCommentButton() {
    await this.removeCommentButton.click();
  }

  @logStep("Click Delivery Tab btn")
  async clickDeliveryTab() {
    await this.deliveryTab.click();
  }

  async openSheduleDeliveryPage() {
    await this.clickDeliveryTab();
    await expect(this.scheduleDeliveryButton).toBeVisible();
    const buttonText = await this.scheduleDeliveryButton.textContent();
    if (buttonText === "Schedule Delivery") {
      this.scheduleDeliveryButton.click();
    }
  }

  async getDeliveryData(): Promise<IDeliveryInfo> {
    const spanTexts = await this.deliveryValues.allTextContents();

    return {
      condition: spanTexts[0] as DELIVERY_CONDITIONS,
      finalDate: spanTexts[1]!,
      address: (await this.getDeliveryAddress()) as IDeliveryAddress,
    };
  }

  async getDeliveryAddress(): Promise<IDeliveryAddress> {
    const spanTexts = await this.deliveryValues.allTextContents();
    return {
      country: spanTexts[2]!,
      city: spanTexts[3]!,
      street: spanTexts[4]!,
      house: +spanTexts[5]!,
      flat: +spanTexts[6]!,
    };
  }
  async getCustomerAddress(customer: ICustomerFromResponse) {
    return _.omit(customer, ["_id", "createdOn", "email", "name", "notes", "phone"]);
  }
}
