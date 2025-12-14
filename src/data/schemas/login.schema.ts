// Schema for POST /api/login response (200)
export const loginSchema = {
  type: "object",
  properties: {
    IsSuccess: {
      type: "boolean",
      description: "Operation success flag",
    },
    ErrorMessage: {
      type: ["string", "null"],
    },
    // API returns current user context together with login result
    User: { type: "object" },
  },
  required: ["IsSuccess", "ErrorMessage"],
  additionalProperties: true,
};

// Schema for POST /api/login error response (400)
export const loginErrorSchema = {
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
  additionalProperties: true,
};
