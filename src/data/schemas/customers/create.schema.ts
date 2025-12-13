import { obligatoryFieldsSchema, obligatoryRequredFields } from "../core.schema";
import { customerSchema } from "./customer.schema";

export const createCustomerSchema = {
  type: "object",
  properties: {
    Customer: customerSchema,
    User: { type: "object" },
    ...obligatoryFieldsSchema,
  },
  required: ["Customer", ...obligatoryRequredFields],
  additionalProperties: true,
};
