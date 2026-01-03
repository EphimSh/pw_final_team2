import { SalesPortalPage } from "../salesPortal.page";
import { IOrderInTable, ORDER_STATUSES, OrdersTableHeader } from "data/types/orders.types";
import { logStep } from "utils/report/logStep.utils";

export class OrdersListPage extends SalesPortalPage {
  readonly title = this.page.locator("h2.fw-bold");
  readonly addNewOrderButton = this.page.locator('[name="add-button"]');
  readonly tableRow = this.page.locator("tbody tr");
  readonly tableRowByOrderNumber = (orderNumber: string) =>
    this.page.locator("table tbody tr", { has: this.page.locator("td", { hasText: orderNumber }) });
  readonly tableRowByIndex = (index: number) => this.page.locator("table tbody tr").nth(index);
  readonly orderNumberCell = (orderNumber: string) => this.tableRowByOrderNumber(orderNumber).locator("td").nth(0);
  readonly emailCell = (orderNumber: string) => this.tableRowByOrderNumber(orderNumber).locator("td").nth(1);
  readonly priceCell = (orderNumber: string) => this.tableRowByOrderNumber(orderNumber).locator("td").nth(2);
  readonly deliveryCell = (orderNumber: string) => this.tableRowByOrderNumber(orderNumber).locator("td").nth(3);
  readonly statusCell = (orderNumber: string) => this.tableRowByOrderNumber(orderNumber).locator("td").nth(4);
  readonly assignedManagerCell = (orderNumber: string) => this.tableRowByOrderNumber(orderNumber).locator("td").nth(5);
  readonly createdOnCell = (orderNumber: string) => this.tableRowByOrderNumber(orderNumber).locator("td").nth(6);
  readonly tableHeader = this.page.locator("thead th div[current]");
  readonly tableHeaderNamed = (name: OrdersTableHeader) => this.tableHeader.filter({ hasText: name });
  readonly tableHeaderArrow = (name: OrdersTableHeader, { direction }: { direction: "asc" | "desc" }) =>
    this.page
      .locator("thead th", { has: this.page.locator("div[current]", { hasText: name }) })
      .locator(`i.${direction === "asc" ? "bi-arrow-down" : "bi-arrow-up"}`);

  readonly detailsButton = (orderNumber: string) => this.tableRowByOrderNumber(orderNumber).getByTitle("Details");
  readonly reopenButton = (orderNumber: string) => this.tableRowByOrderNumber(orderNumber).getByTitle("Reopen");

  readonly searchInput = this.page.locator("#search");
  readonly searchButton = this.page.locator("#search-orders");
  readonly filterButton = this.page.locator("#filter");
  readonly exportButton = this.page.locator("#export");

  readonly uniqueElement = this.addNewOrderButton;

  @logStep("Click Add New Order button on Orders List page")
  async clickAddNewOrder() {
    await this.addNewOrderButton.click();
  }

  @logStep("Get order data from Orders List page")
  async getOrderData(orderNumber: string): Promise<IOrderInTable> {
    const [orderNumberText, email, price, delivery, status, assignedManager, createdOn] =
      await this.tableRowByOrderNumber(orderNumber).locator("td").allInnerTexts();
    return {
      orderNumber: orderNumberText!,
      email: email!,
      price: +price!.replace("$", ""),
      delivery: delivery!,
      status: status! as ORDER_STATUSES,
      assignedManager: assignedManager!,
      createdOn: createdOn!,
    };
  }

  @logStep("Get all orders data from Orders List page")
  async getTableData(): Promise<IOrderInTable[]> {
    const data: IOrderInTable[] = [];

    const rows = await this.tableRow.all();
    for (const row of rows) {
      const [orderNumber, email, price, delivery, status, assignedManager, createdOn] = await row
        .locator("td")
        .allInnerTexts();
      data.push({
        orderNumber: orderNumber!,
        email: email!,
        price: +price!.replace("$", ""),
        delivery: delivery!,
        status: status! as ORDER_STATUSES,
        assignedManager: assignedManager!,
        createdOn: createdOn!,
      });
    }
    return data;
  }

  @logStep("Click action button in Orders List page")
  async clickAction(orderNumber: string, action: "details" | "reopen") {
    if (action === "details") await this.detailsButton(orderNumber).click();
    if (action === "reopen") await this.reopenButton(orderNumber).click();
  }

  @logStep("Click table header in Orders List page")
  async clickTableHeader(name: OrdersTableHeader) {
    await this.tableHeaderNamed(name).click();
  }

  @logStep("Fill search input in Orders List page")
  async fillSearchInput(text: string) {
    await this.searchInput.fill(text);
  }

  @logStep("Click search button in Orders List page")
  async clickSearch() {
    await this.searchButton.click();
  }
}
