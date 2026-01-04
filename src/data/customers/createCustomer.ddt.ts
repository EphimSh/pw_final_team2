import { ERROR_MESSAGES } from "data/notifications/notifications";
import { STATUS_CODES } from "data/statusCode";
import { ICase } from "data/types/core.types";
import { COUNTRIES } from "data/types/countries";
import { generateCustomerData } from "./generateCustomerData";
import { createCustomerSchema } from "data/schemas/customers/create.schema";
import { faker } from "@faker-js/faker";
import { ICustomer } from "data/types/customers.types";
import { errorSchema } from "data/schemas/index.schema";
interface ICreateCustomerCase extends ICase {
  customerData: ICustomer;
  expectedSchema: object;
  expectedIsSuccess?: boolean;
}

export const createCustomerData_positiveCases: ICreateCustomerCase[] = [
  {
    title: "SC-027: Successful customer creation",
    customerData: generateCustomerData(),
    expectedStatus: STATUS_CODES.CREATED,
    expectedSchema: createCustomerSchema,
    expectedIsSuccess: true,
  },
  {
    title: "SC-028: Create customer without optional field notes",
    customerData: generateCustomerData({ notes: "" }),
    expectedStatus: STATUS_CODES.CREATED,
    expectedSchema: createCustomerSchema,
    expectedIsSuccess: true,
  },
];

export const createCustomerData_negativeCases: ICreateCustomerCase[] = [
  {
    title: "SC-029: Invalid email format",
    customerData: generateCustomerData({ email: "invalid-email" }),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: ERROR_MESSAGES.BAD_REQUEST,
    expectedSchema: errorSchema,
    expectedIsSuccess: false,
  },
  {
    title: "SC-030: Invalid country (not from enum list)",
    customerData: generateCustomerData({ country: "China" as unknown as COUNTRIES }),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: ERROR_MESSAGES.BAD_REQUEST,
    expectedSchema: errorSchema,
    expectedIsSuccess: false,
  },
  {
    title: "SC-032: Missing required fields (phone)",
    customerData: generateCustomerData({ phone: "" }),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: ERROR_MESSAGES.BAD_REQUEST,
    expectedSchema: errorSchema,
    expectedIsSuccess: false,
  },
];

export const createCustomerData_duplicateCases: ICreateCustomerCase[] = [
  {
    title: "SC-031: Duplicate email",
    customerData: generateCustomerData({ email: faker.internet.email() }),
    expectedStatus: STATUS_CODES.CONFLICT,
    expectedSchema: errorSchema,
    expectedIsSuccess: false,
  },
];
