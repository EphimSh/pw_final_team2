import { obligatoryRequredFields } from "../products/core.schema";
import { customerSchema } from "./customer.schema";

// Schema for GET /api/customers and GET /api/customers/all responses (200)
export const getAllCustomersSchema = {
  type: "object",
  properties: {
    customers: {
      type: "array",
      items: customerSchema,
    },
  },
  required: [...obligatoryRequredFields],
};
