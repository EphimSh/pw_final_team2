export const obligatoryFieldsSchema = {
  IsSuccess: { type: "boolean" },
  ErrorMessage: {
    type: ["string", "null"],
  },
};

export const obligatoryRequredFields = ["IsSuccess", "ErrorMessage"];

export const schemaErrorsFields = {
  type: "object",
  properties: {
    instancePath: { type: ["string", "null"] },
    schemaPath: { type: ["string", "null"] },
    keyword: { type: ["string", "null"] },
    params: {
      type: "object",
    },
    message: { type: ["string", "null"] },
  },
  required: ["instancePath", "schemaPath", "keyword", "params", "message"],
  additionalProperties: false,
};

export const errorSchema = {
  type: "object",
  properties: {
    SchemaErrors: {
      type: "array",
      items: schemaErrorsFields,
    },
    ...obligatoryFieldsSchema,
  },
  required: [...obligatoryRequredFields],
};
