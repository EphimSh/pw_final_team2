import { logStep } from "utils/report/logStep.utils";
import { SalesPortalPage } from "../salesPortal.page";

export class requestedProductsSection extends SalesPortalPage {
  readonly uniqueElement = this.page.locator("#products-section");
  readonly modalTitle = this.uniqueElement.locator("h4");
  readonly editRequestedProductsButton = this.uniqueElement.locator("#edit-products-pencil");
  readonly accordeanButton = this.uniqueElement.locator(".accordion-button");

  @logStep("Open Edit Products modal")
  async open() {
    await this.editRequestedProductsButton.click();
  }
}
