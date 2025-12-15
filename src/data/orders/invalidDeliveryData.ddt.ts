import { faker } from "@faker-js/faker";
import { ERROR_MESSAGES } from "data/notifications/notifications";

export const invalidDeliveryAddressData = [
  {
    title: "Invalid address country => empty string",
    deliveryData: { address: { country: "" } },
    errorMessage: ERROR_MESSAGES.BAD_REQUEST,
  },
  {
    title: "Invalid address country => not from Country list)",
    deliveryData: { address: { country: "Moldova" } },
    errorMessage: ERROR_MESSAGES.BAD_REQUEST,
  },
  {
    title: "Invalid address city => empty string",
    deliveryData: { address: { city: "" } },
    errorMessage: ERROR_MESSAGES.BAD_REQUEST_DELIVERY,
  },
  {
    title: "Invalid address city => too long string",
    deliveryData: { address: { city: faker.string.alpha({ length: 21 }) } },
    errorMessage: ERROR_MESSAGES.BAD_REQUEST_DELIVERY,
  },
  {
    title: "Invalid address street => empty string",
    deliveryData: { address: { street: "" } },
    errorMessage: ERROR_MESSAGES.BAD_REQUEST_DELIVERY,
  },
  {
    title: "Invalid address house => zero value",
    deliveryData: { address: { house: 0 } },
    errorMessage: ERROR_MESSAGES.BAD_REQUEST_DELIVERY,
  },
  {
    title: "Invalid address house => negative value",
    deliveryData: { address: { house: -5 } },
    errorMessage: ERROR_MESSAGES.BAD_REQUEST_DELIVERY,
  },
  {
    title: "Invalid address flat => zero value",
    deliveryData: { address: { flat: 0 } },
    errorMessage: ERROR_MESSAGES.BAD_REQUEST_DELIVERY,
  },
  {
    title: "Invalid address flat => negative value",
    deliveryData: { address: { flat: -3 } },
    errorMessage: ERROR_MESSAGES.BAD_REQUEST_DELIVERY,
  },
];
