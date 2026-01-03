import { faker } from "@faker-js/faker";
import { ERROR_MESSAGES } from "data/notifications/notifications";

export const invalidDeliveryAddressData = [
  {
    title: "SC-113: Missing address.country field",
    deliveryData: { address: { country: "" } },
    errorMessage: ERROR_MESSAGES.BAD_REQUEST,
  },
  {
    title: "SC-114: Invalid address.country value",
    deliveryData: { address: { country: "Moldova" } },
    errorMessage: ERROR_MESSAGES.BAD_REQUEST,
  },
  {
    title: "SC-116: Missing address.city field",
    deliveryData: { address: { city: "" } },
    errorMessage: ERROR_MESSAGES.BAD_REQUEST_DELIVERY,
  },
  {
    title: "SC-115: Invalid address city => too long string",
    deliveryData: { address: { city: faker.string.alpha({ length: 21 }) } },
    errorMessage: ERROR_MESSAGES.BAD_REQUEST_DELIVERY,
  },
  {
    title: "SC-117: Missing address.street",
    deliveryData: { address: { street: "" } },
    errorMessage: ERROR_MESSAGES.BAD_REQUEST_DELIVERY,
  },
  {
    title: "SC-118: Missing address.house ",
    deliveryData: { address: { house: 0 } },
    errorMessage: ERROR_MESSAGES.BAD_REQUEST_DELIVERY,
  },
  {
    title: "Invalid address house => negative value",
    deliveryData: { address: { house: -5 } },
    errorMessage: ERROR_MESSAGES.BAD_REQUEST_DELIVERY,
  },
  {
    title: "SC-119: Invalid address flat => zero value",
    deliveryData: { address: { flat: 0 } },
    errorMessage: ERROR_MESSAGES.BAD_REQUEST_DELIVERY,
  },
  {
    title: "SC-120: Invalid address flat => negative value",
    deliveryData: { address: { flat: -3 } },
    errorMessage: ERROR_MESSAGES.BAD_REQUEST_DELIVERY,
  },
];
