import { AddNewProductPage } from "ui/pages/products/addNewProduct.page";

export class EditProductPage extends AddNewProductPage {
  readonly saveButton = this.page.locator("#save-product-changes");
}
