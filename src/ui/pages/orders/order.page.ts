import { ICustomerOnOrderPage } from "data/types/customers.types";
import { SalesPortalPage } from "../salesPortal.page";
import { logStep } from "utils/report/logStep.utils";
import { requestedProductsSection } from "./requestedProducts.section";
import { editProductsModal } from "./editProducts.modal";
import { COUNTRIES } from "data/types/countries";

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
  readonly notification = this.page.locator(".toast-body");
  readonly orderId = this.page.locator("//*[text()='Order number: ']//following-sibling::span");
  readonly refreshOrderButton = this.page.locator("#refresh-order");
  readonly customerValue = this.page.locator("#customer-section .p-3 .s-span:nth-child(2)");

  readonly uniqueElement = this.title;

  readonly requestedOrders = new requestedProductsSection(this.page);
  readonly editProductsModal = new editProductsModal(this.page);

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

  @logStep("Click Refresh Order button on Order Details page")
  async clickRefreshOrderButton() {
    await this.refreshOrderButton.click();
  }

  @logStep("Get Customer data from Order Details page")
  async getCustomerData(): Promise<ICustomerOnOrderPage> {
    const [email, name, country, city, street, house, flat, phone, createdOn, notes] =
      await this.customerValue.allInnerTexts();

    return {
      email: email!,
      name: name!,
      country: country! as COUNTRIES,
      city: city!,
      street: street!,
      house: +house!,
      flat: +flat!,
      phone: phone!,
      createdOn: createdOn!,
      notes: notes === "-" ? "" : notes!,
    };
  }
}
