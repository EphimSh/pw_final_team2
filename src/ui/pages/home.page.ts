import { Locator } from "@playwright/test";
import { SalesPortalPage } from "./salesPortal.page";
import { logStep } from "utils/report/logStep.utils";

export type HomeModuleButton = "Products" | "Customers" | "Orders";

export class HomePage extends SalesPortalPage {
  readonly welcomeText = this.page.locator(".welcome-text");
  readonly productsButton = this.page.locator("#products-from-home");
  readonly customersButton = this.page.locator("#customers-from-home");
  readonly ordersButton = this.page.locator("#orders-from-home");
  readonly uniqueElement = this.welcomeText;
  readonly orderThisYear = this.page.locator("#total-orders-container p");
  readonly newCustomers = this.page.locator("#total-customers-container p");
  readonly canceledOrders = this.page.locator("#canceled-orders-container p");
  readonly totalRevenue = this.page.locator("#total-revenue-container p");
  readonly avgOrdersValue = this.page.locator("#avg-orders-value-container p");

  @logStep("Click on module button on Home page")
  async clickOnViewModule(module: HomeModuleButton) {
    const moduleButtons: Record<HomeModuleButton, Locator> = {
      Products: this.productsButton,
      Customers: this.customersButton,
      Orders: this.ordersButton,
    };

    await moduleButtons[module].click();
  }
}
