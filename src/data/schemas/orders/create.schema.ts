import { obligatoryFieldsSchema, obligatoryRequredFields } from "../core.schema";
import { orderSchema } from "./order.schema";

export const createOrderSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    Order: orderSchema,
    ...obligatoryFieldsSchema,
  },
  required: ["Order", ...obligatoryRequredFields],
};
