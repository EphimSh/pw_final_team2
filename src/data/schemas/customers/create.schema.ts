import { obligatoryFieldsSchema, obligatoryRequredFields } from "../index.schema";
import { customerSchema } from "./customer.schema";

// Schema for POST /api/customers response (201)
export const createCustomerSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    Customer: customerSchema,
    ...obligatoryFieldsSchema,
  },
  required: ["Customer", ...obligatoryRequredFields],
};
