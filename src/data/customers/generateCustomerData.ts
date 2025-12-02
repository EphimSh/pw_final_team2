import { faker } from "@faker-js/faker";
import { ICustomer } from "data/types/customers.types";
import { COUNTRIES } from "./countries";
import { getRandomEnumValue } from "utils/enum.utils";

export function generateCustomerData(params?: Partial<ICustomer>): ICustomer {
  return {
    email: faker.internet.email(),
    name: faker.string.alpha({ length: { min: 1, max: 40 } }),
    country: getRandomEnumValue(COUNTRIES),
    city: faker.string.alpha({ length: { min: 1, max: 20 } }),
    street: faker.string.alphanumeric({ length: { min: 1, max: 40 } }),
    house: faker.number.int({ min: 1, max: 199 }),
    flat: faker.number.int({ min: 1, max: 9 }),
    phone: "+" + faker.string.numeric({ length: 10 }),
    notes: faker.string.alphanumeric({ length: { min: 1, max: 250 } }),
    ...params,
  };
}
