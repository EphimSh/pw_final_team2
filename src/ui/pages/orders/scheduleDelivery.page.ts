import { DELIVERY_CONDITIONS, DeliveryLocation, IDeliveryInfo } from "data/types/orders.types";
import { SalesPortalPage } from "../salesPortal.page";
import { convertToDate } from "utils/date.utils";
import { expect } from "fixtures";

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

  async fillForm(deliveryData: DeepPartial<IDeliveryInfo>) {
    if (deliveryData.condition) await this.deliveryTypeSelect.selectOption(deliveryData.condition);
    console.log(await this.getDeliveryType());
    if ((await this.getDeliveryType()) === DELIVERY_CONDITIONS.DELIVERY) {
      this.selectLocation("Other");
    }
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

  async clickSave() {
    await expect(this.saveDeliveryButton).toBeEnabled();
    await this.saveDeliveryButton.click();
  }

  async selectLocation(location: DeliveryLocation) {
    await this.locationSelect.selectOption(location);
  }

  async clickCancel() {
    await this.cancelButton.click();
  }

  async clickDate() {
    await this.dateInput.click();
  }

  async getDeliveryType(): Promise<DELIVERY_CONDITIONS> {
    return (await this.deliveryTypeSelect.textContent()) as DELIVERY_CONDITIONS;
  }
}
