import { obligatoryFieldsSchema } from "../core.schema";
import { customerSchema } from "./customer.schema";
import { SortOrder } from "data/types/core.types";
import { CustomersSortField } from "data/types/customers.types";

export const getSortedSchema = {
  type: "object",
  properties: {
    customers: {
      type: "array",
      items: customerSchema,
    },
    total: { type: "number" },
    page: { type: "number" },
    limit: { type: "number" },
    search: { type: "string" },
    country: { type: "array" },
    sorting: {
      type: "object",
      properties: {
        sortField: { type: "string" as CustomersSortField },
        sortOrder: { type: "string" as SortOrder },
      },
      required: ["sortField", "sortOrder"],
    },
    ...obligatoryFieldsSchema,
  },
};
