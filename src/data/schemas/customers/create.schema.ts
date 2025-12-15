import { obligatoryFieldsSchema, obligatoryRequredFields } from "../core.schema";
import { customerSchema } from "./customer.schema";

export const createCustomerSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    Customer: customerSchema,
    User: { type: "object" },
    ...obligatoryFieldsSchema,
  },
  required: ["Customer", ...obligatoryRequredFields],
};
