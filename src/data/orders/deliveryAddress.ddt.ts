import { faker } from "@faker-js/faker";
import { COUNTRIES } from "data/types/countries";
import { IDeliveryAddress } from "data/types/orders.types";

export const deliveryAddress = [
  {
    title: "Check Country is set correctly when only Country is changed",
    address: { country: COUNTRIES.BELARUS },
    modifiedField: "country" as keyof IDeliveryAddress,
  },
  {
    title: "Check City is set correctly when only City is changed",
    address: { city: "Mock City " + faker.string.alpha({ length: { min: 1, max: 10 } }) },
    modifiedField: "city" as keyof IDeliveryAddress,
  },
  {
    title: "Check Street is set correctly when only Street is changed",
    address: { street: "MockStreet" + faker.string.alphanumeric({ length: { min: 1, max: 30 } }) },
    modifiedField: "street" as keyof IDeliveryAddress,
  },
  {
    title: "Check House is set correctly when only House is changed",
    address: { house: faker.number.int({ min: 200, max: 399 }) },
    modifiedField: "house" as keyof IDeliveryAddress,
  },
  {
    title: "Check Flat is set correctly when only Flat is changed",
    address: { flat: faker.number.int({ min: 20, max: 39 }) },
    modifiedField: "flat" as keyof IDeliveryAddress,
  },
];
