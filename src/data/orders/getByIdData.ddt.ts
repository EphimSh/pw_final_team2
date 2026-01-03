import { errorSchema } from "data/schemas/core.schema";
import { STATUS_CODES } from "data/statusCode";
import { ICase } from "data/types/core.types";

export type OrderPreparation = "draft" | "withDeliveryAndComment";

export interface IGetOrderByIdCase extends ICase {
  id?: string;
  expectedSchema?: object;
  expectedIsSuccess?: boolean;
  expectedErrorMessage?: string | null;
  prepare?: OrderPreparation;
  expectRelatedData?: boolean;
}

export const getOrderByIdData_negativeCases: IGetOrderByIdCase[] = [
  {
    title: "SC-075: Non-existent order ID",
    id: "000000000000000000000000",
    expectedStatus: STATUS_CODES.NOT_FOUND,
    expectedSchema: errorSchema,
    expectedIsSuccess: false,
    expectedErrorMessage: null,
  },
  {
    title: "SC-076: Invalid ID format",
    id: "invalid_id",
    expectedStatus: STATUS_CODES.SERVER_ERROR,
    expectedSchema: errorSchema,
    expectedIsSuccess: false,
    expectedErrorMessage: null,
  },
];
