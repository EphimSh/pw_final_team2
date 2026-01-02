import { obligatoryFieldsSchema, obligatoryRequredFields } from "../core.schema";

const orderForGetOrdersByCustomerSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "_id",
    "status",
    "customer",
    "products",
    "delivery",
    "total_price",
    "createdOn",
    "comments",
    "history",
    "assignedManager",
  ],
  properties: {
    _id: { type: "string" },
    status: { type: "string" },
    customer: { type: "string" },
    products: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["_id", "name", "amount", "price", "manufacturer", "notes", "received"],
        properties: {
          _id: { type: "string" },
          name: { type: "string" },
          amount: { type: "number" },
          price: { type: "number" },
          manufacturer: { type: "string" },
          notes: { type: "string" },
          received: { type: "boolean" },
        },
      },
    },
    delivery: { type: ["object", "null"] },
    total_price: { type: "number" },
    createdOn: { type: "string" },
    comments: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["_id", "text", "createdOn"],
        properties: {
          _id: { type: "string" },
          text: { type: "string" },
          createdOn: { type: "string" },
        },
      },
    },
    history: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "status",
          "customer",
          "products",
          "total_price",
          "delivery",
          "changedOn",
          "action",
          "performer",
          "assignedManager",
        ],
        properties: {
          status: { type: "string" },
          customer: { type: "string" },
          products: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              required: ["_id", "name", "amount", "price", "manufacturer", "notes", "received"],
              properties: {
                _id: { type: "string" },
                name: { type: "string" },
                amount: { type: "number" },
                price: { type: "number" },
                manufacturer: { type: "string" },
                notes: { type: "string" },
                received: { type: "boolean" },
              },
            },
          },
          total_price: { type: "number" },
          delivery: { type: ["object", "null"] },
          changedOn: { type: "string" },
          action: { type: "string" },
          performer: {
            type: "object",
            additionalProperties: false,
            required: ["_id", "username", "firstName", "lastName", "roles", "createdOn"],
            properties: {
              _id: { type: "string" },
              username: { type: "string" },
              firstName: { type: "string" },
              lastName: { type: "string" },
              roles: { type: "array", items: { type: "string" } },
              createdOn: { type: "string" },
            },
          },
          assignedManager: { type: ["object", "null"] },
        },
      },
    },
    assignedManager: { type: ["object", "null"] },
  },
};

export const getOrdersByCustomerSchema = {
  type: "object",
  properties: {
    Orders: {
      type: "array",
      items: orderForGetOrdersByCustomerSchema,
    },
    ...obligatoryFieldsSchema,
  },
  required: ["Orders", ...obligatoryRequredFields],
  additionalProperties: true,
};
