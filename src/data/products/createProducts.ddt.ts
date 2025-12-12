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
    title: "SC-001: Успешное создание товара (имя 3 символа)",
    productData: generateProductData({ name: faker.string.alphanumeric({ length: 3 }) }),
    expectedStatus: STATUS_CODES.CREATED,
  },
  {
    title: "SC-001: Успешное создание товара (имя 40 символов)",
    productData: generateProductData({ name: faker.string.alphanumeric({ length: 40 }) }),
    expectedStatus: STATUS_CODES.CREATED,
  },
  {
    title: "SC-001: Успешное создание товара (имя с одним пробелом)",
    productData: generateProductData({ name: `Test Product` }),
  },
  {
    title: "SC-001: Успешное создание товара (price = 1)",
    productData: generateProductData({ price: 1 }),
    expectedStatus: STATUS_CODES.CREATED,
  },
  {
    title: "SC-001: Успешное создание товара (price = 99999)",
    productData: generateProductData({ price: 99999 }),
    expectedStatus: STATUS_CODES.CREATED,
  },
  {
    title: "SC-001: Успешное создание товара (amount = 0)",
    productData: generateProductData({ amount: 0 }),
    expectedStatus: STATUS_CODES.CREATED,
  },
  {
    title: "SC-001: Успешное создание товара (amount = 999)",
    productData: generateProductData({ amount: 999 }),
    expectedStatus: STATUS_CODES.CREATED,
  },
  {
    title: "SC-001: Успешное создание товара (notes 250 символов)",
    productData: generateProductData({ notes: faker.string.alphanumeric({ length: 250 }) }),
    expectedStatus: STATUS_CODES.CREATED,
  },
  {
    title: "SC-002: Создание товара без notes",
    productData: _.omit(generateProductData(), "notes"),
    expectedStatus: STATUS_CODES.CREATED,
  },
  {
    title: "SC-002: Создание товара с пустым notes",
    productData: generateProductData({ notes: "" }),
    expectedStatus: STATUS_CODES.CREATED,
  },
];

export const createProductNegativeCases: ICreateProductCase[] = [
  {
    title: "SC-003: Ошибка валидации name (2 символа)",
    productData: generateProductData({ name: faker.string.alphanumeric({ length: 2 }) }),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: ERROR_MESSAGES.BAD_REQUEST,
  },
  {
    title: "SC-003: Ошибка валидации name (41 символ)",
    productData: generateProductData({ name: faker.string.alphanumeric({ length: 41 }) }),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: ERROR_MESSAGES.BAD_REQUEST,
  },
  {
    title: "SC-003: Ошибка валидации name (двойные пробелы)",
    productData: generateProductData({ name: "Test  Product" }),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: ERROR_MESSAGES.BAD_REQUEST,
  },
  {
    title: "SC-003: Ошибка валидации name (спецсимволы)",
    productData: generateProductData({ name: faker.string.alphanumeric({ length: 10 }) + "@#$%" }),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: ERROR_MESSAGES.BAD_REQUEST,
  },
  {
    title: "SC-003: Отсутствует обязательное поле name",
    productData: _.omit(generateProductData(), "name"),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: ERROR_MESSAGES.BAD_REQUEST,
  },
  {
    title: "SC-003: Ошибка валидации name (пустая строка)",
    productData: generateProductData({ name: "" }),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: ERROR_MESSAGES.BAD_REQUEST,
  },
  {
    title: "SC-005: Ошибка валидации price (0)",
    productData: generateProductData({ price: 0 }),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: ERROR_MESSAGES.BAD_REQUEST,
  },
  {
    title: "SC-004: Отсутствует обязательное поле manufacturer",
    productData: _.omit(generateProductData(), "manufacturer"),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: ERROR_MESSAGES.BAD_REQUEST,
  },
  {
    title: "SC-005: Ошибка валидации price (100000)",
    productData: generateProductData({ price: 100000 }),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: ERROR_MESSAGES.BAD_REQUEST,
  },
  {
    title: "SC-005: Отсутствует обязательное поле price",
    productData: _.omit(generateProductData(), "price"),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: ERROR_MESSAGES.BAD_REQUEST,
  },
  {
    title: "SC-005: Ошибка валидации price (отрицательное значение)",
    productData: generateProductData({ price: -50 }),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: ERROR_MESSAGES.BAD_REQUEST,
  },
  {
    title: "SC-005: Ошибка валидации price (нечисловое значение)",
    productData: generateProductData({ price: faker.string.alphanumeric({ length: 5 }) }),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: ERROR_MESSAGES.BAD_REQUEST,
  },
  {
    title: "SC-005: Ошибка валидации amount (отрицательное значение)",
    productData: generateProductData({ amount: -10 }),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: ERROR_MESSAGES.BAD_REQUEST,
  },
  {
    title: "SC-005: Ошибка валидации amount (1000)",
    productData: generateProductData({ amount: 1000 }),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: ERROR_MESSAGES.BAD_REQUEST,
  },
  {
    title: "SC-005: Отсутствует обязательное поле amount",
    productData: _.omit(generateProductData(), "amount"),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: ERROR_MESSAGES.BAD_REQUEST,
  },
  {
    title: "SC-005: Ошибка валидации amount (нечисловое значение)",
    productData: generateProductData({ amount: faker.string.alphanumeric({ length: 3 }) }),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: ERROR_MESSAGES.BAD_REQUEST,
  },
  {
    title: "SC-002: Ошибка валидации notes (длина > 250)",
    productData: generateProductData({ notes: faker.string.alphanumeric({ length: 251 }) }),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: ERROR_MESSAGES.BAD_REQUEST,
  },
  {
    title: "SC-002: Ошибка валидации notes (недопустимые символы)",
    productData: generateProductData({ notes: "Invalid notes with <symbol>" }),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: ERROR_MESSAGES.BAD_REQUEST,
  },
  {
    title: "SC-004: Невалидный manufacturer (не из списка)",
    productData: generateProductData({ manufacturer: "Huawei" as IProduct["manufacturer"] }),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: ERROR_MESSAGES.BAD_REQUEST,
  },
  {
    title: "SC-005: Ошибка валидации amount и price (отрицательные)",
    productData: generateProductData({ amount: -5, price: -100 }),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: ERROR_MESSAGES.BAD_REQUEST,
  },
];
