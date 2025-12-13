import { STATUS_CODES } from "data/statusCode";
import { ICase } from "data/types/core.types";

interface IInvalidFormatIdCase extends ICase {
  requestId: string;
  expectedStatus: number;
}

// Invalid product IDs for negative testing
export const invalidIds: IInvalidFormatIdCase[] = [
  {
    title: "SC-017: Invalid product ID format (too short)",
    requestId: "123",
    expectedStatus: STATUS_CODES.SERVER_ERROR,
  },
  {
    title: "SC-017: Invalid product ID format (non-hex characters)",
    requestId: "not-a-valid-id",
    expectedStatus: STATUS_CODES.SERVER_ERROR,
  },
  {
    title: "SC-017: Invalid product ID format (23 characters)",
    requestId: "507f1f77bcf86cd79943901",
    expectedStatus: STATUS_CODES.SERVER_ERROR,
  },
  {
    title: "SC-017: Invalid product ID format (empty string)",
    requestId: "",
    expectedStatus: STATUS_CODES.SERVER_ERROR,
  },
  {
    title: "SC-017: Invalid product ID format (literal null)",
    requestId: "null",
    expectedStatus: STATUS_CODES.SERVER_ERROR,
  },
  {
    title: "SC-017: Invalid product ID format (literal undefined)",
    requestId: "undefined",
    expectedStatus: STATUS_CODES.SERVER_ERROR,
  },
  {
    title: "SC-017: Invalid product ID format (non-hex character 'g')",
    requestId: "507f1f77bcf86cd79943901g",
    expectedStatus: STATUS_CODES.SERVER_ERROR,
  },
];
