import { getCustomerSchema } from "data/schemas/customers/get.schema";
import { errorSchema } from "data/schemas/products/core.schema";
import { STATUS_CODES } from "data/statusCode";
import { ICase } from "data/types/core.types";
import { ICustomer } from "data/types/customers.types";
import { generateCustomerData } from "./generateCustomerData";

interface IGetCustomerById extends ICase {
  id?: string;
  customerData?: ICustomer;
  expectedSchema?: object;
  expectedIsSuccess?: boolean;
}

export const getCustomerByIdData_positiveCases: IGetCustomerById[] = [
  {
    title: "SC-041: Успешное получение клиента по валидному ID",
    customerData: generateCustomerData(),
    expectedStatus: STATUS_CODES.OK,
    expectedSchema: getCustomerSchema,
    expectedIsSuccess: true,
  },
];

export const getCustomerByIdData_negativeCases: IGetCustomerById[] = [
  {
    title: 'SC-042: Невалидный формат ID клиента ("123")',
    id: "123",
    expectedStatus: STATUS_CODES.SERVER_ERROR,
    expectedIsSuccess: false,
  },
  {
    title: "SC-043: Получение клиента по несуществующему ID (валидный формат)",
    id: "0123456789abcdef01234567",
    expectedStatus: STATUS_CODES.NOT_FOUND,
    expectedSchema: errorSchema,
    expectedIsSuccess: false,
  },
];
