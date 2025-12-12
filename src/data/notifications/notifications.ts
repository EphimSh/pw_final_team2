export enum NOTIFICATIONS {
  PRODUCT_CREATED = "Product was successfully created",
  PRODUCT_DELETED = "Product was successfully deleted",
  PRODUCT_UPDATED = "Product was successfully updated",
  CUSTOMER_CREATED = "Customer was successfully created",
  CUSTOMER_DELETED = "Customer was successfully deleted",
  CUSTOMER_UPDATED = "Customer was successfully updated",
}

export const ERROR_MESSAGES = {
  UNAUTHORIZED: "Not authorized",
  PRODUCT_NOT_FOUND: (id: string) => `Product with id '${id}' wasn't found`,
  PRODUCT_ALREADY_EXISTS: (name: string) => `Product with name '${name}' already exists`,
  BAD_REQUEST: "Incorrect request body",
  FAILED_TO_CAST_OBJECT: (value: string, model: string, path: string) =>
    `Cast to ObjectId failed for value "${value}" (type string) at path "${path}" for model "${model}"`,
};
