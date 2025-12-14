import { obligatoryFieldsSchema, obligatoryRequredFields } from "../core.schema";
import { customerSchema } from "./customer.schema";

// Schema for GET /api/customers and GET /api/customers/all responses (200)
export const getAllCustomersSchema = {
  type: "object",
  properties: {
    Customers: {
      type: "array",
      items: customerSchema,
    },
    // API may attach current user info; allow it without failing validation
    User: { type: "object" },
    ...obligatoryFieldsSchema,
  },
  required: ["Customers", ...obligatoryRequredFields],
  additionalProperties: true,
};
