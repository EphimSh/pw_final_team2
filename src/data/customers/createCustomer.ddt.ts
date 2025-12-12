import { ERROR_MESSAGES } from "data/notifications/notifications";
import { STATUS_CODES } from "data/statusCode";
import { ICase } from "data/types/core.types";
import { COUNTRIES } from "data/types/countries";
import { generateCustomerData } from "./generateCustomerData";
import { createCustomerSchema } from "data/schemas/customers/create.schema";
import { faker } from "@faker-js/faker";
import { errorSchema } from "data/schemas/products/core.schema";
import { ICustomer } from "data/types/customers.types";

interface ICreateCustomerCase extends ICase {
  customerData: ICustomer;
  expectedSchema: object;
  expectedIsSuccess?: boolean;
}

export const createCustomerData_positiveCases: ICreateCustomerCase[] = [
  {
    title: "SC-027: Успешное создание клиента",
    customerData: generateCustomerData(),
    expectedStatus: STATUS_CODES.CREATED,
    expectedSchema: createCustomerSchema,
    expectedIsSuccess: true,
  },
  {
    title: "SC-028: Создание клиента без опционального поля notes",
    customerData: generateCustomerData({ notes: "" }),
    expectedStatus: STATUS_CODES.CREATED,
    expectedSchema: createCustomerSchema,
    expectedIsSuccess: true,
  },
];

export const createCustomerData_negativeCases: ICreateCustomerCase[] = [
  {
    title: "SC-029: Невалидный email формат",
    customerData: generateCustomerData({ email: "invalid-email" }),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: ERROR_MESSAGES.BAD_REQUEST,
    expectedSchema: errorSchema,
    expectedIsSuccess: false,
  },
  {
    title: "SC-030: Невалидная страна (не из списка enum)",
    customerData: generateCustomerData({ country: "China" as unknown as COUNTRIES }),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: ERROR_MESSAGES.BAD_REQUEST,
    expectedSchema: errorSchema,
    expectedIsSuccess: false,
  },
  {
    title: "SC-032: Отсутствие обязательных полей (phone)",
    customerData: generateCustomerData({ phone: "" }),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: ERROR_MESSAGES.BAD_REQUEST,
    expectedSchema: errorSchema,
    expectedIsSuccess: false,
  },
];

export const createCustomerData_duplicateCases: ICreateCustomerCase[] = [
  {
    title: "SC-031: Дубликат email",
    customerData: generateCustomerData({ email: faker.internet.email() }),
    expectedStatus: STATUS_CODES.CONFLICT,
    expectedSchema: errorSchema,
    expectedIsSuccess: false,
  },
];
