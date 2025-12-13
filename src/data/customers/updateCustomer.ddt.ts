import { ERROR_MESSAGES } from "data/notifications/notifications";
import { updateCustomerSchema } from "data/schemas/customers/update.schema";
import { errorSchema } from "data/schemas/index.schema";
import { STATUS_CODES } from "data/statusCode";
import { ICase } from "data/types/core.types";
import { COUNTRIES } from "data/types/countries";
import { ICustomer } from "data/types/customers.types";
import { generateCustomerData } from "./generateCustomerData";

interface IUpdateCustomerCase extends ICase {
  id?: string;
  customerData?: Partial<ICustomer>;
  updatedCustomerData?: Partial<ICustomer>;
  expectedSchema?: object;
  expectedIsSuccess?: boolean;
  additionalData?: object;
}

const generalCustomerData = generateCustomerData();

export const updateCustomer_positiveCases: IUpdateCustomerCase[] = [
  {
    title: "SC-044: Полное обновление клиента",
    customerData: generalCustomerData!,
    updatedCustomerData: generateCustomerData(),
    expectedStatus: STATUS_CODES.OK,
    expectedSchema: updateCustomerSchema,
    expectedIsSuccess: true,
  },
  {
    title: "SC-045: Обновление одного поля (email)",
    customerData: generalCustomerData,
    updatedCustomerData: { ...generalCustomerData, email: generateCustomerData().email },
    expectedStatus: STATUS_CODES.OK,
    expectedSchema: updateCustomerSchema,
    expectedIsSuccess: true,
  },
  {
    title: "SC-046: Обновление нескольких полей (name, phone)",
    customerData: generalCustomerData,
    updatedCustomerData: {
      ...generalCustomerData,
      name: generateCustomerData().name,
      phone: generateCustomerData().phone,
    },
    expectedStatus: STATUS_CODES.OK,
    expectedSchema: updateCustomerSchema,
    expectedIsSuccess: true,
  },
];

export const updateCustomer_negativeCases: IUpdateCustomerCase[] = [
  {
    title: 'SC-047: Обновление с невалидным email ("invalid")',
    customerData: generalCustomerData,
    updatedCustomerData: { ...generalCustomerData, email: "invalid" },
    expectedStatus: STATUS_CODES.SERVER_ERROR,
    expectedSchema: errorSchema,
    expectedErrorMessage: ERROR_MESSAGES.FAILED_TO_CAST_OBJECT("undefined", "Customer", "_id"),
    expectedIsSuccess: false,
  },
  {
    title: "SC-050: Обновление с невалидным значением country",
    customerData: generalCustomerData,
    updatedCustomerData: { ...generalCustomerData, country: "China" as unknown as COUNTRIES },
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedSchema: errorSchema,
    expectedErrorMessage: ERROR_MESSAGES.BAD_REQUEST,
    expectedIsSuccess: false,
  },
];

export const updateCustomer_notFoundCases: IUpdateCustomerCase[] = [
  {
    title: "SC-048: Обновление несуществующего клиента",
    id: "0123456789abcdef01234567",
    updatedCustomerData: generateCustomerData(),
    expectedStatus: STATUS_CODES.NOT_FOUND,
    expectedSchema: errorSchema,
    expectedIsSuccess: false,
  },
];

export const updateCustomer_conflictCases: IUpdateCustomerCase[] = [
  {
    title: "SC-049: Конфликт при обновлении email",
    additionalData: generateCustomerData({ email: "conflict@example.com" }),
    customerData: generateCustomerData(),
    updatedCustomerData: { ...generalCustomerData, email: "conflict@example.com" },
    expectedStatus: STATUS_CODES.CONFLICT,
    expectedSchema: errorSchema,
    expectedIsSuccess: false,
  },
];
