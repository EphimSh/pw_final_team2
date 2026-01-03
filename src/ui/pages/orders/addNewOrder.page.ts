import { IOrderCreateBody } from "data/types/orders.types";
import { BaseModal } from "../base.modal";
import { logStep } from "utils/report/logStep.utils";

export class AddNewOrderPage extends BaseModal {
  readonly uniqueElement = this.page.locator("#create-order-form");

  readonly title = this.page.locator("div.modal-header h5.modal-title");
  readonly closeButton = this.page.locator("div.modal-header button.btn-close");
  readonly customerSelect = this.page.locator("#inputCustomerOrder");
  readonly productsSection = this.page.locator("#products-section");
  readonly productSelects = this.productsSection.locator('select[name="Product"]');
  readonly addProductButton = this.page.locator("#add-product-btn");
  readonly deleteProductButtons = this.productsSection.locator("button.del-btn-modal");
  readonly totalPrice = this.page.locator("#total-price-order-modal");
  readonly createButton = this.page.locator("#create-order-btn");
  readonly cancelButton = this.page.locator("#cancel-order-modal-btn");

  @logStep("Fill Create Order form")
  async fillForm(orderData: Partial<IOrderCreateBody>) {
    if (orderData.customer) {
      await this.customerSelect.selectOption(orderData.customer);
    }

    if (orderData.products && orderData.products.length > 0) {
      await this.productSelects.first().selectOption(orderData.products[0]!);
      for (let i = 1; i < orderData.products.length; i++) {
        await this.addProductButton.click();
        await this.productSelects.nth(i).waitFor();
        await this.productSelects.nth(i).selectOption(orderData.products[i]!);
      }
    }
  }

  @logStep("Select customer by email in Create Order modal")
  async selectCustomerByEmail(email: string) {
    const option = this.customerSelect.locator(`option[title="${email}"]`).first();
    const value = await option.getAttribute("value");
    if (!value) {
      throw new Error(`Customer option with email "${email}" not found`);
    }
    await this.customerSelect.selectOption(value);
  }

  @logStep("Select product in Create Order modal")
  async selectProduct(value: string, index: number = 0) {
    await this.productSelects.nth(index).selectOption(value);
  }

  @logStep("Click Add Product button in Create Order modal")
  async clickAddProduct() {
    await this.addProductButton.click();
  }

  @logStep("Delete product row in Create Order modal")
  async deleteProduct(index: number) {
    await this.deleteProductButtons.nth(index).click();
  }

  @logStep("Click Create button in Create Order modal")
  async clickCreate() {
    await this.createButton.click();
  }

  @logStep("Click Cancel button in Create Order modal")
  async clickCancel() {
    await this.cancelButton.click();
  }

  @logStep("Click Close button in Create Order modal")
  async clickClose() {
    await this.closeButton.click();
  }
}
