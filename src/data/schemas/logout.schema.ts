// Schema for POST /api/logout response (200)
export const logoutSchema = {
  type: "object",
  properties: {
    IsSuccess: {
      type: "boolean",
      description: "Operation success flag",
    },
    ErrorMessage: {
      type: ["string", "null"],
    },
  },
  required: ["IsSuccess", "ErrorMessage"],
  additionalProperties: false,
};

// Schema for POST /api/logout error response (401)
export const logoutUnauthorizedSchema = {
  type: "object",
  properties: {
    IsSuccess: {
      type: "boolean",
      description: "Operation success flag",
    },
    ErrorMessage: {
      type: "string",
      description: "Error message in case of failure",
    },
  },
  required: ["IsSuccess", "ErrorMessage"],
  additionalProperties: false,
};

// Schema for POST /api/logout error response (500)
export const logoutServerErrorSchema = {
  type: "object",
  properties: {
    IsSuccess: {
      type: "boolean",
      description: "Operation success flag",
    },
    ErrorMessage: {
      type: "string",
      description: "Error message in case of failure",
    },
  },
  required: ["IsSuccess", "ErrorMessage"],
  additionalProperties: false,
};
