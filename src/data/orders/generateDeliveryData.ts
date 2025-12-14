import { faker } from "@faker-js/faker";
import { COUNTRIES } from "data/types/countries";
import { DELIVERY_CONDITIONS, IDeliveryAddress, IDeliveryInfo } from "data/types/orders.types";
import { getRandomEnumValue } from "utils/enum.utils";

export function generateDeliveryData(params?: Partial<IDeliveryInfo>): IDeliveryInfo {
  return {
    address: generateDeliveryAdressData(),
    finalDate: faker.date.future().toISOString().split("T")[0]!,

    condition: getRandomEnumValue(DELIVERY_CONDITIONS),
    ...params,
  };
}

export function generateDeliveryAdressData(params?: Partial<IDeliveryAddress>): IDeliveryAddress {
  return {
    country: getRandomEnumValue(COUNTRIES),
    city: faker.string.alpha({ length: { min: 1, max: 20 } }),
    street: faker.string.alphanumeric({ length: { min: 1, max: 40 } }),
    house: faker.number.int({ min: 1, max: 199 }),
    flat: faker.number.int({ min: 1, max: 9 }),
    ...params,
  };
}
