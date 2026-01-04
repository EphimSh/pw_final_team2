import { faker } from "@faker-js/faker";
import _ from "lodash";
import { ICase } from "data/types/core.types";
import { IProduct } from "data/types/products.types";
import { generateProductData } from "./generateProductData";
import { STATUS_CODES } from "data/statusCode";
import { ERROR_MESSAGES } from "data/notifications/notifications";

interface ICreateProductCase extends ICase {
  productData: Partial<IProduct>;
}

export const createProductPositiveCases: ICreateProductCase[] = [
  {
    title: "SC-001: Successful product creation (name 3 characters)",
    productData: generateProductData({ name: faker.string.alphanumeric({ length: 3 }) }),
    expectedStatus: STATUS_CODES.CREATED,
  },
  {
    title: "SC-001: Successful product creation (name 40 characters)",
    productData: generateProductData({ name: faker.string.alphanumeric({ length: 40 }) }),
    expectedStatus: STATUS_CODES.CREATED,
  },
  {
    title: "SC-001: Successful product creation (name with one space)",
    productData: generateProductData({ name: `Test Product` }),
  },
  {
    title: "SC-001: Successful product creation (price = 1)",
    productData: generateProductData({ price: 1 }),
    expectedStatus: STATUS_CODES.CREATED,
  },
  {
    title: "SC-001: Successful product creation (price = 99999)",
    productData: generateProductData({ price: 99999 }),
    expectedStatus: STATUS_CODES.CREATED,
  },
  {
    title: "SC-001: Successful product creation (amount = 0)",
    productData: generateProductData({ amount: 0 }),
    expectedStatus: STATUS_CODES.CREATED,
  },
  {
    title: "SC-001: Successful product creation (amount = 999)",
    productData: generateProductData({ amount: 999 }),
    expectedStatus: STATUS_CODES.CREATED,
  },
  {
    title: "SC-001: Successful product creation (notes 250 characters)",
    productData: generateProductData({ notes: faker.string.alphanumeric({ length: 250 }) }),
    expectedStatus: STATUS_CODES.CREATED,
  },
  {
    title: "SC-002: Create product without notes",
    productData: _.omit(generateProductData(), "notes"),
    expectedStatus: STATUS_CODES.CREATED,
  },
  {
    title: "SC-002: Create product with empty notes",
    productData: generateProductData({ notes: "" }),
    expectedStatus: STATUS_CODES.CREATED,
  },
];

export const createProductNegativeCases: ICreateProductCase[] = [
  {
    title: "SC-003: Name validation error (2 characters)",
    productData: generateProductData({ name: faker.string.alphanumeric({ length: 2 }) }),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: ERROR_MESSAGES.BAD_REQUEST,
  },
  {
    title: "SC-003: Name validation error (41 characters)",
    productData: generateProductData({ name: faker.string.alphanumeric({ length: 41 }) }),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: ERROR_MESSAGES.BAD_REQUEST,
  },
  {
    title: "SC-003: Name validation error (double spaces)",
    productData: generateProductData({ name: "Test  Product" }),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: ERROR_MESSAGES.BAD_REQUEST,
  },
  {
    title: "SC-003: Name validation error (special characters)",
    productData: generateProductData({ name: faker.string.alphanumeric({ length: 10 }) + "@#$%" }),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: ERROR_MESSAGES.BAD_REQUEST,
  },
  {
    title: "SC-003: Missing required field name",
    productData: _.omit(generateProductData(), "name"),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: ERROR_MESSAGES.BAD_REQUEST,
  },
  {
    title: "SC-003: Name validation error (empty string)",
    productData: generateProductData({ name: "" }),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: ERROR_MESSAGES.BAD_REQUEST,
  },
  {
    title: "SC-005: Price validation error (0)",
    productData: generateProductData({ price: 0 }),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: ERROR_MESSAGES.BAD_REQUEST,
  },
  {
    title: "SC-004: Missing required field manufacturer",
    productData: _.omit(generateProductData(), "manufacturer"),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: ERROR_MESSAGES.BAD_REQUEST,
  },
  {
    title: "SC-005: Price validation error (100000)",
    productData: generateProductData({ price: 100000 }),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: ERROR_MESSAGES.BAD_REQUEST,
  },
  {
    title: "SC-005: Missing required field price",
    productData: _.omit(generateProductData(), "price"),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: ERROR_MESSAGES.BAD_REQUEST,
  },
  {
    title: "SC-005: Price validation error (negative value)",
    productData: generateProductData({ price: -50 }),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: ERROR_MESSAGES.BAD_REQUEST,
  },
  {
    title: "SC-005: Price validation error (non-numeric value)",
    productData: generateProductData({ price: faker.string.alphanumeric({ length: 5 }) }),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: ERROR_MESSAGES.BAD_REQUEST,
  },
  {
    title: "SC-005: Amount validation error (negative value)",
    productData: generateProductData({ amount: -10 }),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: ERROR_MESSAGES.BAD_REQUEST,
  },
  {
    title: "SC-005: Amount validation error (1000)",
    productData: generateProductData({ amount: 1000 }),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: ERROR_MESSAGES.BAD_REQUEST,
  },
  {
    title: "SC-005: Missing required field amount",
    productData: _.omit(generateProductData(), "amount"),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: ERROR_MESSAGES.BAD_REQUEST,
  },
  {
    title: "SC-005: Amount validation error (non-numeric value)",
    productData: generateProductData({ amount: faker.string.alphanumeric({ length: 3 }) }),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: ERROR_MESSAGES.BAD_REQUEST,
  },
  {
    title: "SC-002: Notes validation error (length > 250)",
    productData: generateProductData({ notes: faker.string.alphanumeric({ length: 251 }) }),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: ERROR_MESSAGES.BAD_REQUEST,
  },
  {
    title: "SC-002: Notes validation error (invalid characters)",
    productData: generateProductData({ notes: "Invalid notes with <symbol>" }),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: ERROR_MESSAGES.BAD_REQUEST,
  },
  {
    title: "SC-004: Invalid manufacturer (not from list)",
    productData: generateProductData({ manufacturer: "Huawei" as IProduct["manufacturer"] }),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: ERROR_MESSAGES.BAD_REQUEST,
  },
  {
    title: "SC-005: Amount and price validation error (negative values)",
    productData: generateProductData({ amount: -5, price: -100 }),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: ERROR_MESSAGES.BAD_REQUEST,
  },
];
