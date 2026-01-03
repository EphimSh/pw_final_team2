import { ROLES } from "data/types/user.types";

export const userSchema = {
  type: "object",
  additionalProperties: false,
  required: ["_id", "username", "firstName", "lastName", "roles", "createdOn"],
  properties: {
    _id: { type: "string" },
    username: { type: "string" },
    firstName: { type: "string" },
    lastName: { type: "string" },
    roles: { type: "array", items: { type: "string", enum: Object.values(ROLES) } },
    createdOn: { type: "string" },
  },
};
