import { SalesPortalPage } from "../salesPortal.page";
import { logStep } from "utils/report/logStep.utils";

export class OrderPage extends SalesPortalPage {
  readonly title = this.page.locator("#order-details-header h2.fw-bold");
  readonly orderStatusValue = this.page
    .locator("#order-status-bar-container > div")
    .first()
    .locator("span.text-primary");
  readonly assignedManagerContainer = this.page.locator("#assigned-manager-container");
  readonly editAssignedManagerButton = this.page.getByTitle("Edit Assigned Manager");
  readonly selectManagerLink = this.assignedManagerContainer.locator("u");
  readonly assignManagerModalContainer = this.page.locator("#assign-manager-modal-container");
  readonly managerSearchInput = this.page.locator("#manager-search-input");
  readonly managerList = this.page.locator("#manager-list");
  readonly managerItemByName = (name: string) => this.managerList.locator("li", { hasText: name }).first();

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
}
