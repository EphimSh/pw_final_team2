import { obligatoryFieldsSchema, obligatoryRequredFields } from "../core.schema";
import { userSchema } from "./user.schema";

export const createUserSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    User: userSchema,
    ...obligatoryFieldsSchema,
  },
  required: ["User", ...obligatoryRequredFields],
};
