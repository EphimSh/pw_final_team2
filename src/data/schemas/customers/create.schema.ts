import { obligatoryFieldsSchema, obligatoryRequredFields } from "../products/core.schema";
import { customerSchema } from "./customer.schema";

// Schema for POST /api/customers response (201)

export const createCustomerSchema = {
  type: "object",
  properties: {
    Product: customerSchema,
    ...obligatoryFieldsSchema,
  },
  required: ["Customer", ...obligatoryRequredFields],
};
