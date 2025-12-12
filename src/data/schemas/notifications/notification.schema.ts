export const notificationSchema = {
  type: "object",
  properties: {
    _id: {
      type: "string",
    },
    userId: {
      type: "string",
    },
    type: {
      type: "string",
    },
    orderId: {
      type: "string",
    },
    message: {
      type: "string",
    },
    read: {
      type: "boolean",
    },
    createdAt: {
      type: "string",
    },
    expiresAt: {
      type: "string",
    },
    updatedAt: {
      type: "string",
    },
  },
  required: ["_id", "userId", "type", "orderId", "message", "read", "createdAt", "expiresAt", "updatedAt"],
  additionalProperties: false,
};
