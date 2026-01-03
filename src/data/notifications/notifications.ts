export enum NOTIFICATIONS {
  PRODUCT_CREATED = "Product was successfully created",
  PRODUCT_DELETED = "Product was successfully deleted",
  PRODUCT_UPDATED = "Product was successfully updated",
  CUSTOMER_CREATED = "Customer was successfully created",
  CUSTOMER_DELETED = "Customer was successfully deleted",
  CUSTOMER_UPDATED = "Customer was successfully updated",
  MANAGER_FOR_ORDER_ASSIGNED = "Manager was successfully assigned to the order",
  MANAGER_FOR_ORDER_UNASSIGNED = "Manager was successfully unassigned from the order",
  ORDER_CREATED = "Order was successfully created",
  ORDER_CANCELED = "Order was successfully canceled",
  ORDER_UPDATED = "Order was successfully updated",
  ORDER_REOPENED = "Order was successfully reopened",
  DELIVERY_SAVED = "Delivery was successfully saved",
  PROCESS_STARTED = "Order processing was successfully started",
  PRODUCTS_RECEIVED = "Products were successfully received",
  COMMENT_ADDED = "Comment was successfully posted",
  COMMENT_DELETED = "Comment was successfully deleted",
}

export const ERROR_MESSAGES = {
  UNAUTHORIZED: "Not authorized",
  PRODUCT_NOT_FOUND: (id: string) => `Product with id '${id}' wasn't found`,
  PRODUCT_ALREADY_EXISTS: (name: string) => `Product with name '${name}' already exists`,
  BAD_REQUEST: "Incorrect request body",
  BAD_REQUEST_DELIVERY: "Incorrect Delivery",
  FAILED_TO_CAST_OBJECT: (value: string, model: string, path: string) =>
    `Cast to ObjectId failed for value "${value}" (type string) at path "${path}" for model "${model}"`,
  COMMENT_NOT_FOUND: `Comment was not found`,
  ORDER_NOT_FOUND: (id: string) => `Order with id ${id} wasn't found`,
  MISSING_CUSTOMER: "Missing customer",
  MISSING_PRODUCT_ID: "Id was not provided",
};
