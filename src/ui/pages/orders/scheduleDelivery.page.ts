import { DELIVERY_CONDITIONS, DeliveryLocation, IDeliveryInfo } from "data/types/orders.types";
import { SalesPortalPage } from "../salesPortal.page";
import { convertToDate } from "utils/date.utils";
import { expect } from "fixtures";
import { COUNTRIES } from "data/types/countries";
import { generateDeliveryDate } from "data/orders/generateDeliveryData";
import { logStep } from "utils/report/logStep.utils";

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export class ScheduleDeliveryPage extends SalesPortalPage {
  readonly title = this.page.locator("#title");
  readonly deliveryTypeSelect = this.page.locator("#inputType");
  readonly locationSelect = this.page.locator("#inputLocation");
  readonly countrySelect = this.page.locator("#selectCountry");
  readonly cityInput = this.page.locator("#inputCity");
  readonly streetInput = this.page.locator("#inputStreet");
  readonly houseInput = this.page.locator("#inputHouse");
  readonly flatInput = this.page.locator("#inputFlat");
  readonly saveDeliveryButton = this.page.locator("#save-delivery");
  readonly cancelButton = this.page.locator("#back-to-order-details-page");
  readonly dateInput = this.page.locator("#date-input");

  readonly uniqueElement = this.saveDeliveryButton;

  @logStep("Fill Delivery Form")
  async fillForm(deliveryData: DeepPartial<IDeliveryInfo>) {
    if (deliveryData.condition) await this.deliveryTypeSelect.selectOption(deliveryData.condition);
    await this.selectLocation("Other");
    if (deliveryData.address?.country) await this.countrySelect.selectOption(deliveryData.address?.country);
    if (deliveryData.address?.city) await this.cityInput.fill(deliveryData.address?.city);
    if (deliveryData.address?.street) await this.streetInput.fill(deliveryData.address?.street);
    if (deliveryData.address?.house) await this.houseInput.fill(deliveryData.address?.house.toString());
    if (deliveryData.address?.flat) await this.flatInput.fill(deliveryData.address?.flat.toString());
    if (deliveryData.finalDate) {
      const convertedDate = convertToDate(deliveryData.finalDate);
      await this.dateInput.click();
      await this.page.evaluate((text) => {
        navigator.clipboard.writeText(text);
      }, convertedDate);

      await this.dateInput.press("Control+V");
      await this.dateInput.press("Enter");
    }
  }

  @logStep("Save Delivery Address")
  async clickSave() {
    await expect(this.saveDeliveryButton).toBeEnabled();
    await this.saveDeliveryButton.click();
  }

  @logStep("Select Delivery Location")
  async selectLocation(location: DeliveryLocation) {
    await this.locationSelect.selectOption(location);
  }

  @logStep("Click Cancel")
  async clickCancel() {
    await this.cancelButton.click();
  }

  @logStep("CLick Delivery Date")
  async clickDate() {
    await this.dateInput.click();
  }

  @logStep("Get Delivery Type")
  async getDeliveryType(): Promise<DELIVERY_CONDITIONS> {
    return (await this.deliveryTypeSelect.textContent()) as DELIVERY_CONDITIONS;
  }

  @logStep("Choose Pick up Delivery ")
  async choosePickUpDelivery(country?: COUNTRIES) {
    await this.deliveryTypeSelect.selectOption(DELIVERY_CONDITIONS.PICK_UP);
    if (country) await this.countrySelect.selectOption(country);
  }
  @logStep("Fill Delivery Date")
  async fillDeliveryDate(date: string) {
    const convertedDate = convertToDate(date);
    await this.dateInput.click();
    await this.page.evaluate((text) => {
      navigator.clipboard.writeText(text);
    }, convertedDate);

    await this.dateInput.press("Control+V");
    await this.dateInput.press("Enter");
  }

  @logStep("Set Delivery Location")
  async setDeliveryDate(date?: string) {
    await this.fillDeliveryDate(date || generateDeliveryDate());
  }
}
