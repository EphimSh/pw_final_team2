import { faker } from "@faker-js/faker";
import { COUNTRIES } from "data/types/countries";
import { DELIVERY_CONDITIONS, IDeliveryAddress, IDeliveryInfo } from "data/types/orders.types";
import moment from "moment";
import { convertToDate } from "utils/date.utils";
import { getRandomEnumValue } from "utils/enum.utils";

export function generateDeliveryData(params?: Partial<IDeliveryInfo>): IDeliveryInfo {
  return {
    address: params?.address
      ? params.address // address was provided
      : generateDeliveryAdressData(), // generate new address
    finalDate: convertToDate(moment().add(5, "days").toISOString()),
    condition: getRandomEnumValue(DELIVERY_CONDITIONS),
    ...params,
  };
}

export function generateDeliveryDate() {
  return convertToDate(moment().add(5, "days").toISOString());
}

export function generateDeliveryAdressData(params?: Partial<IDeliveryAddress>): IDeliveryAddress {
  return {
    country: getRandomEnumValue(COUNTRIES),
    city: "Mock City " + faker.string.alpha({ length: { min: 1, max: 10 } }),
    street: "MockStreet" + faker.string.alphanumeric({ length: { min: 1, max: 30 } }),
    house: faker.number.int({ min: 1, max: 199 }),
    flat: faker.number.int({ min: 1, max: 19 }),
    ...params,
  };
}
