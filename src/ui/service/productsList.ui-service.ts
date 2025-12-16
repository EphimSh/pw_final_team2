import test, { expect, Page } from "@playwright/test";
import { IProductDetails } from "data/types/products.types";

import _ from "lodash";
import { AddNewProductPage } from "ui/pages/products/addNewProduct.page";
import { ProductsListPage } from "ui/pages/products/productsList.page";
import { convertToFullDateAndTime } from "utils/date.utils";
import { logStep } from "utils/report/logStep.utils";

export class ProductsListUIService {
  productsListPage: ProductsListPage;
  addNewProductPage: AddNewProductPage;

  constructor(private page: Page) {
    this.productsListPage = new ProductsListPage(page);
    this.addNewProductPage = new AddNewProductPage(page);
  }

  @logStep("Open Add New Product Page")
  async openAddNewProductPage() {
    await this.productsListPage.clickAddNewProduct();
    await this.addNewProductPage.waitForOpened();
  }

  @logStep("Delete Details Modal on Products List Page")
  async openDetailsModal(productName: string) {
    await this.productsListPage.detailsButton(productName).click();
    await this.productsListPage.detailsModal.waitForOpened();
  }

  @logStep("Open Delete modal on Products List Page")
  async openDeleteModal(productName: string) {
    await this.productsListPage.clickAction(productName, "delete");
    await this.productsListPage.deleteModal.waitForOpened();
  }

  @logStep("Delete Product on Products List Page")
  async deleteProduct(productName: string) {
    await this.productsListPage.clickAction(productName, "delete");
    await this.productsListPage.deleteModal.waitForOpened();
    await this.productsListPage.deleteModal.clickConfirm();
    await this.productsListPage.deleteModal.waitForClosed();
  }

  async search(text: string) {
    await test.step(`Search for "${text}" on Products List page`, async () => {
      await this.productsListPage.fillSearchInput(text);
      await this.productsListPage.clickSearch();
      await this.productsListPage.waitForOpened();
    });
  }

  @logStep("Open Products List Page")
  async open() {
    await this.productsListPage.open("products");
    await this.productsListPage.waitForOpened();
  }

  assertDetailsData(actual: IProductDetails, expected: IProductDetails) {
    expect(actual).toEqual({
      ..._.omit(expected, ["_id"]),
      createdOn: convertToFullDateAndTime(expected.createdOn),
    });
  }

  async assertProductInTable(productName: string, { visible }: { visible: boolean }) {
    await expect(
      this.productsListPage.tableRowByName(productName),
      `Product "${productName}" should be in table`,
    ).toBeVisible({ visible });
  }
}
