import { IProductDetails } from "data/types/products.types";
import { SalesPortalPage } from "../salesPortal.page";

import { logStep } from "utils/report/logStep.utils";
import { MANUFACTURERS } from "data/types/manufacturers";

export class ProductDetailsModal extends SalesPortalPage {
  readonly uniqueElement = this.page.locator("#ProductDetailsModal");

  readonly title = this.uniqueElement.locator("h5");
  readonly closeButton = this.uniqueElement.locator("button.btn-close");
  readonly editButton = this.uniqueElement.locator("button.btn-primary");
  readonly cancelButton = this.uniqueElement.locator("button.btn-secondary");

  readonly productValue = this.uniqueElement.locator("p");

  @logStep("Click Close button on Product Details modal")
  async clickClose() {
    await this.closeButton.click();
  }

  @logStep("Click Cancel button on Product Details modal")
  async clickCancel() {
    await this.cancelButton.click();
  }

  @logStep("Click Edit button on Product Details modal")
  async clickEdit() {
    await this.editButton.click();
  }

  @logStep("Get data from Product Details modal")
  async getData(): Promise<IProductDetails> {
    const [name, amount, price, manufacturer, createdOn, notes] = await this.productValue.allInnerTexts();

    return {
      name: name!,
      amount: +amount!,
      price: +price!,
      manufacturer: manufacturer! as MANUFACTURERS,
      createdOn: createdOn!,
      notes: notes === "-" ? "" : notes!,
    };
  }
}
