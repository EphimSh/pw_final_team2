import { expect, Locator } from "@playwright/test";
import { BasePage } from "./base.page";
import { SALES_PORTAL_URL } from "config/env";
import { logStep } from "utils/report/logStep.utils";

export abstract class SalesPortalPage extends BasePage {
  readonly spinner = this.page.locator(".spinner-border");
  readonly toastMessage = this.page.locator(".toast-body");
  readonly closeToastMessageButton = this.page.locator(".toast button.btn-close");
  abstract readonly uniqueElement: Locator;

  @logStep("Wait for Sales Portal page to be opened")
  async waitForOpened() {
    await expect(this.uniqueElement).toBeVisible({ timeout: 10000 });
    await this.waitForSpinners();
  }

  @logStep("Wait for spinners to disappear on Sales Portal page")
  async waitForSpinners() {
    await expect(this.spinner).toHaveCount(0, { timeout: 10000 });
  }

  @logStep("Open Sales Portal page")
  async open(route: string = "") {
    const base = SALES_PORTAL_URL.endsWith("/") ? SALES_PORTAL_URL : SALES_PORTAL_URL + "/";
    const path = route ? route.replace(/^\//, "") : "";
    await this.page.goto(base + path);
  }

  @logStep("Close toast message on Sales Portal page")
  async closeToastMessage() {
    await this.closeToastMessageButton.click();
  }
}
