import { faker } from "@faker-js/faker";
import { COUNTRIES } from "data/types/countries";
import { DELIVERY_CONDITIONS, IDeliveryInfo } from "data/types/orders.types";
import moment from "moment";
import { convertToDate } from "utils/date.utils";
import { getRandomEnumValue } from "utils/enum.utils";

export function generateDelivery(customData: Partial<IDeliveryInfo> = {}): IDeliveryInfo {
  const baseAddress = {
    country: getRandomEnumValue(COUNTRIES),
    city: "Mock City" + faker.string.alpha(5),
    street: "Mock Street" + faker.string.alpha(5),
    house: faker.number.int({ min: 1, max: 999 }),
    flat: faker.number.int({ min: 1, max: 9999 }),
  };

  const finalDate = moment().add(5, "days").toISOString();

  return {
    address: baseAddress,
    finalDate: convertToDate(finalDate),
    condition: DELIVERY_CONDITIONS.DELIVERY,
    ...customData,
  };
}
