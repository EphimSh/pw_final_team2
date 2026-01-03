import { obligatoryFieldsSchema, obligatoryRequredFields } from "../core.schema";
import { userSchema } from "./user.schema";

export const getAllUsersSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    Users: {
      type: "array",
      items: userSchema,
    },
    ...obligatoryFieldsSchema,
  },
  required: ["Users", ...obligatoryRequredFields],
};
