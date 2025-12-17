import { SalesPortalPage } from "../salesPortal.page";

import { ProductDetailsModal } from "./details.modal";
import { ConfirmationModal } from "../confirmation.modal";
import { logStep } from "utils/report/logStep.utils";
import { IProductInTable, ProductsTableHeader } from "data/types/products.types";
import { MANUFACTURERS } from "data/types/manufacturers";

export class ProductsListPage extends SalesPortalPage {
  readonly detailsModal = new ProductDetailsModal(this.page);
  readonly deleteModal = new ConfirmationModal(this.page);

  readonly productsPageTitle = this.page.locator("h2.fw-bold");
  readonly addNewProductButton = this.page.locator('[name="add-button"]');
  readonly tableRow = this.page.locator("tbody tr");
  readonly tableRowByName = (productName: string) =>
    this.page.locator("table tbody tr", { has: this.page.locator("td", { hasText: productName }) });
  readonly tableRowByIndex = (index: number) => this.page.locator("table tbody tr").nth(index);
  readonly nameCell = (productName: string) => this.tableRowByName(productName).locator("td").nth(0);
  readonly priceCell = (productName: string) => this.tableRowByName(productName).locator("td").nth(1);
  readonly manufacturerCell = (productName: string) => this.tableRowByName(productName).locator("td").nth(2);
  readonly createdOnCell = (nameOrIndex: string | number) =>
    typeof nameOrIndex === "string"
      ? this.tableRowByName(nameOrIndex).locator("td").nth(3)
      : this.tableRowByIndex(nameOrIndex).locator("td").nth(3);
  readonly tableHeader = this.page.locator("thead th div[current]");
  readonly tableHeaderNamed = (name: ProductsTableHeader) => this.tableHeader.filter({ hasText: name });

  readonly tableHeaderArrow = (name: ProductsTableHeader, { direction }: { direction: "asc" | "desc" }) =>
    this.page
      .locator("thead th", { has: this.page.locator("div[current]", { hasText: name }) })
      .locator(`i.${direction === "asc" ? "bi-arrow-down" : "bi-arrow-up"}`);

  readonly editButton = (productName: string) => this.tableRowByName(productName).getByTitle("Edit");
  readonly detailsButton = (productName: string) => this.tableRowByName(productName).getByTitle("Details");
  readonly deleteButton = (productName: string) => this.tableRowByName(productName).getByTitle("Delete");

  readonly searchInput = this.page.locator("#search");
  readonly searchButton = this.page.locator("#search-products");

  readonly uniqueElement = this.addNewProductButton;

  @logStep("Click Add New Product button on Products List page")
  async clickAddNewProduct() {
    await this.addNewProductButton.click();
  }

  @logStep("Get product data from Products List page")
  async getProductData(productName: string): Promise<IProductInTable> {
    const [name, price, manufacturer, createdOn] = await this.tableRowByName(productName).locator("td").allInnerTexts();
    return {
      name: name!,
      price: +price!.replace("$", ""),
      manufacturer: manufacturer! as MANUFACTURERS,
      createdOn: createdOn!,
    };
  }

  @logStep("Get all products data from Products List page")
  async getTableData(): Promise<IProductInTable[]> {
    const data: IProductInTable[] = [];

    const rows = await this.tableRow.all();
    for (const row of rows) {
      const [name, price, manufacturer, createdOn] = await row.locator("td").allInnerTexts();
      data.push({
        name: name!,
        price: +price!.replace("$", ""),
        manufacturer: manufacturer! as MANUFACTURERS,
        createdOn: createdOn!,
      });
    }
    return data;
  }

  @logStep("Click action button in Products List page")
  async clickAction(productName: string, button: "edit" | "delete" | "details") {
    if (button === "edit") await this.editButton(productName).click();
    if (button === "delete") await this.deleteButton(productName).click();
    if (button === "details") await this.detailsButton(productName).click();
  }

  @logStep("Click table header in Products List page")
  async clickTableHeader(name: ProductsTableHeader) {
    await this.tableHeaderNamed(name).click();
  }

  @logStep("Fill search input in Products List page")
  async fillSearchInput(text: string) {
    await this.searchInput.fill(text);
  }

  @logStep("Click search button in Products List page")
  async clickSearch() {
    await this.searchButton.click();
  }
}
