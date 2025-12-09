import { customerSchema } from "./customer.schema";

// Schema for GET /api/customers and GET /api/customers/all responses (200)
export const getAllCustomersSchema = {
  type: "object",
  properties: {
    Customers: {
      type: "array",
      items: customerSchema,
    },
    IsSuccess: { type: "boolean" },
    ErrorMessage: { type: ["string", "null"] },
  },
  required: ["Customers", "IsSuccess", "ErrorMessage"],
  additionalProperties: false,
};
