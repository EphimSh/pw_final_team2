import { COUNTRIES } from "data/types/countries";

export const ordeWithDeliverySchema = {
  type: "object",
  additionalProperties: false,
  required: ["Order", "IsSuccess", "ErrorMessage"],
  properties: {
    IsSuccess: { type: "boolean" },
    ErrorMessage: { type: ["string", "null"] },

    Order: {
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

        customer: {
          type: "object",
          additionalProperties: false,
          required: [
            "_id",
            "email",
            "name",
            "country",
            "city",
            "street",
            "house",
            "flat",
            "phone",
            "createdOn",
            "notes",
          ],
          properties: {
            _id: { type: "string" },
            email: { type: "string" },
            name: { type: "string" },
            country: { type: "string", enum: Object.values(COUNTRIES) },
            city: { type: "string" },
            street: { type: "string" },
            house: { type: "number" },
            flat: { type: "number" },
            phone: { type: "string" },
            createdOn: { type: "string" },
            notes: { type: "string" },
          },
        },

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

        delivery: {
          type: ["object", "null"],
          additionalProperties: false,
          required: ["address", "finalDate", "condition"],
          properties: {
            address: {
              type: "object",
              additionalProperties: false,
              required: ["country", "city", "street", "house", "flat"],
              properties: {
                country: { type: "string", enum: Object.values(COUNTRIES) },
                city: { type: "string" },
                street: { type: "string" },
                house: { type: "number" },
                flat: { type: "number" },
              },
            },
            finalDate: { type: "string" },
            condition: { type: "string" }, // Pickup | Delivery
          },
        },

        total_price: { type: "number" },
        createdOn: { type: "string" },

        comments: {
          type: "array",
          items: { type: "object" },
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

              delivery: {
                type: ["object", "null"],
                additionalProperties: false,
                required: ["address", "finalDate", "condition"],
                properties: {
                  address: {
                    type: "object",
                    additionalProperties: false,
                    required: ["country", "city", "street", "house", "flat"],
                    properties: {
                      country: { type: "string", enum: Object.values(COUNTRIES) },
                      city: { type: "string" },
                      street: { type: "string" },
                      house: { type: "number" },
                      flat: { type: "number" },
                    },
                  },
                  finalDate: { type: "string" },
                  condition: { type: "string" },
                },
              },

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
                  roles: {
                    type: "array",
                    items: { type: "string" },
                  },
                  createdOn: { type: "string" },
                },
              },

              assignedManager: { type: ["object", "null"] },
            },
          },
        },

        assignedManager: { type: ["object", "null"] },
      },
    },
  },
};

// export const ordeWithDeliverySchema = {
//   type: "object",
//   additionalProperties: false,
//   required: [
//     "_id",
//     "status",
//     "customer",
//     "products",
//     "delivery",
//     "total_price",
//     "createdOn",
//     "comments",
//     "history",
//     "assignedManager",
//   ],
//   properties: {
//     _id: { type: "string" },
//     status: { type: "string" },
//     customer: {
//       type: "object",
//       additionalProperties: false,
//       required: ["_id", "email", "name", "country", "city", "street", "house", "flat", "phone", "createdOn", "notes"],
//       //properties: customerSchema.properties,
//       properties: {
//         _id: { type: "string" },
//         email: { type: "string" },
//         name: { type: "string" },
//         country: { type: "string", enum: Object.values(COUNTRIES)},
//         city: { type: "string" },
//         street: { type: "string" },
//         house: { type: "number" },
//         flat: { type: "number" },
//         phone: { type: "string" },
//         createdOn: { type: "string" },
//         notes: { type: "string" },
//       },
//     },
//     products: {
//       type: "array",
//       items: {
//         type: "object",
//         additionalProperties: false,
//         required: ["_id", "name", "amount", "price", "manufacturer", "notes", "received"],
//         properties: {
//           _id: { type: "string" },
//           name: { type: "string" },
//           amount: { type: "number" },
//           price: { type: "number" },
//           manufacturer: { type: "string" },
//           notes: { type: "string" },
//           received: { type: "boolean" },
//         },
//       },
//     },
//     // delivery:
//     // // { type: ["object", "null"] },
//     //   {type: "object",
//     //   //additionalProperties: false,
//     //   required: [
//     //     "address",
//     //     "finalDate",
//     //     "condition",
//     //   ],
//     //   properties: {
//     //   address: {
//     //     type: "object",
//     //     additionalProperties: false,
//     //     required: [
//     //         "country",
//     //         "city",
//     //         "street",
//     //         "house",
//     //         "flat",
//     //       ],
//     //     properties: {
//     //       country: { type: "string", enum: Object.values(COUNTRIES)},
//     //       city: { type: "string" },
//     //       street: { type: "string" },
//     //       house: { type: "number" },
//     //       flat: { type: "number" },
//     //     },
//     //   finalDate: { type: "string" },
//     //   condition: { type: "string", enum: Object.values(DELIVERY_CONDITIONS)},
//     //   },
//     //   },
//     // },
//     // total_price: { type: "number" },
//     // createdOn: { type: "string" },

//     delivery: {
//       type: "object",
//       additionalProperties: false,
//       required: ["address", "finalDate", "condition"],
//       properties: {
//         address: {
//           type: "object",
//           additionalProperties: false,
//           required: ["country", "city", "street", "house", "flat"],
//           properties: {
//             country: { type: "string", enum: Object.values(COUNTRIES) },
//             city: { type: "string" },
//             street: { type: "string" },
//             house: { type: "number" },
//             flat: { type: "number" },
//           },
//         },
//         finalDate: { type: "string" }, // ISO date-time
//         condition: { type: "string" }, // e.g. "Delivery"
//       },
//     },
//     total_price: { type: "number" },
//     createdOn: { type: "string" }, // ISO date-time
//     comments: {
//       type: "array",
//       items: {
//         type: "object",
//         additionalProperties: false,
//         required: ["_id", "text", "createdOn"],
//         properties: {
//           _id: { type: "string" },
//           text: { type: "string" },
//           createdOn: { type: "string" },
//         },
//       },
//     },
//     history: {
//       type: "array",
//       items: {
//         type: "object",
//         additionalProperties: false,
//         required: [
//           "status",
//           "customer",
//           "products",
//           "total_price",
//           "delivery",
//           "changedOn",
//           "action",
//           "performer",
//           "assignedManager",
//         ],
//         properties: {
//           status: { type: "string" },
//           customer: { type: "string" },
//           products: {
//             type: "array",
//             items: {
//               type: "object",
//               additionalProperties: false,
//               required: ["_id", "name", "amount", "price", "manufacturer", "notes", "received"],
//               properties: {
//                 _id: { type: "string" },
//                 name: { type: "string" },
//                 amount: { type: "number" },
//                 price: { type: "number" },
//                 manufacturer: { type: "string" },
//                 notes: { type: "string" },
//                 received: { type: "boolean" },
//               },
//             },
//           },
//           total_price: { type: "number" },
//           delivery: {
//       type: "object",
//       additionalProperties: false,
//       required: ["address", "finalDate", "condition"],
//       properties: {
//         address: {
//           type: "object",
//           additionalProperties: false,
//           required: ["country", "city", "street", "house", "flat"],
//           properties: {
//             country: { type: "string", enum: Object.values(COUNTRIES) },
//             city: { type: "string" },
//             street: { type: "string" },
//             house: { type: "number" },
//             flat: { type: "number" },
//           },
//         },
//         finalDate: { type: "string" }, // ISO date-time
//         condition: { type: "string" }, // e.g. "Delivery"
//       },
//     },
//           changedOn: { type: "string" },
//           action: { type: "string" },
//           performer: {
//             type: "object",
//             additionalProperties: false,
//             required: ["_id", "username", "firstName", "lastName", "roles", "createdOn"],
//             properties: {
//               _id: { type: "string" },
//               username: { type: "string" },
//               firstName: { type: "string" },
//               lastName: { type: "string" },
//               roles: { type: "array", items: { type: "string" } },
//               createdOn: { type: "string" },
//             },
//           },
//           assignedManager: { type: ["object", "null"] },
//         },
//       },
//     },
//     assignedManager: { type: ["object", "null"] },
//   },
// };
