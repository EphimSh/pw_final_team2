import { logStep } from "utils/report/logStep.utils";
import { BaseModal } from "../base.modal";

export class editProductsModal extends BaseModal {
  readonly uniqueElement = this.page.locator(".modal-content");
  readonly modalTitle = this.uniqueElement.locator("h5");
  readonly closeButton = this.uniqueElement.locator("[aria-label='Close']");
  readonly saveButton = this.uniqueElement.locator("#update-products-btn");
  readonly cancelButton = this.uniqueElement.locator("#cancel-edit-products-modal-btn");
  readonly addProductButton = this.uniqueElement.locator("button#add-product-btn");
  readonly productSelect = this.uniqueElement.locator("select");
  readonly productDropdown = (productName: string) =>
    this.uniqueElement.locator(`//*[@selected][@value='${productName}']//parent::select`);
  readonly deleteProductButton = (productName: string) =>
    this.uniqueElement.locator(
      `//*[@selected][@value='${productName}']//parent::select//parent::div//following-sibling::div//button`,
    );

  @logStep("Add Product to the Order")
  async addProduct(productName: string) {
    await this.addProductButton.click();
    await this.productDropdown(productName);
  }

  @logStep("Edit Product in the Order")
  async editProduct(currentProductName: string, newProductName: string) {
    await this.productDropdown(currentProductName).selectOption(newProductName);
  }

  @logStep("Delete Product from the Order")
  async deleteProduct(productName: string) {
    await this.deleteProductButton(productName).click();
  }

  @logStep("Save Changes")
  async saveProduct() {
    await this.saveButton.click();
  }

  @logStep("Return amount of products in the Order")
  async getProductsCount(): Promise<number> {
    return await this.uniqueElement.locator("select").count();
  }
}
