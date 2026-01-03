import { SortOrder } from "./core.types";
import { ICustomerFromResponse } from "./customers.types";
import { IProduct } from "./products.types";
import { IUserInfo } from "./user.types";

export interface IDeliveryAddress {
  country: string;
  city: string;
  street: string;
  house: number;
  flat: number;
}

export interface IDeliveryInfo {
  address: IDeliveryAddress;
  finalDate: string;
  condition: DELIVERY_CONDITIONS;
}

export enum DELIVERY_CONDITIONS {
  DELIVERY = "Delivery",
  PICK_UP = "Pickup",
}

export interface IOrderProduct extends IProduct {
  _id: string;
  received: boolean;
}

export enum ORDER_STATUSES {
  DRAFT = "Draft",
  IN_PROCESS = "In Process",
  PARTIALLY_RECEIVED = "Partially Received",
  RECEIVED = "Received",
  CANCELED = "Canceled",
}

export enum ORDER_HISTORY_ACTIONS {
  CREATED = "Order created",
  CUSTOMER_CHANGED = "Customer changed",
  REQUIRED_PRODUCTS_CHANGED = "Requested products changed",
  PROCESSED = "Order processing started",
  DELIVERY_SCHEDULED = "Delivery Scheduled",
  DELIVERY_EDITED = "Delivery Edited",
  RECEIVED = "Received",
  RECEIVED_ALL = "All products received",
  CANCELED = "Order canceled",
  MANAGER_ASSIGNED = "Manager Assigned",
  MANAGER_UNASSIGNED = "Manager Unassigned",
  REOPENED = "Order reopened",
}

export interface IOrderHistoryEntry {
  assignedManager: IUserInfo | null;
  status: ORDER_STATUSES;
  customer: string;
  products: IOrderProduct[];
  total_price: number;
  delivery: IDeliveryInfo | null;
  changedOn: string;
  action: ORDER_HISTORY_ACTIONS;
  performer: IUserInfo;
}

export interface IComment {
  text: string;
  createdOn: string;
  _id: string;
}

export interface IOrder {
  _id: string;
  status: ORDER_STATUSES;
  customer: ICustomerFromResponse;
  products: IOrderProduct[];
  delivery: IDeliveryInfo | null;
  total_price: number;
  createdOn: string;
  comments: IComment[];
  history: IOrderHistoryEntry[];
  assignedManager: IUserInfo | null;
}

export interface IOrderResponse {
  Order: IOrder;
  IsSuccess: boolean;
  ErrorMessage: string | null;
}

export interface IOrdersResponse {
  Orders: IOrder[];
  IsSuccess: boolean;
  ErrorMessage: string | null;
  limit: number;
  page: number;
  search: string;
  status: ORDER_STATUSES[];
  total: number;
  sorting: { sortField: OrdersSortField; sortOrder: SortOrder };
}
export type OrdersSortField = "createdOn" | "email" | "name" | "orderNumber" | "price" | "status" | "assignedManager";

export interface IOrderCreateBody {
  customer: string;
  products: string[];
}

export interface ICommendUIData {
  commentText: string;
  commentator: string;
  createdOn: string;
}

export interface IGetOrdersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: ORDER_STATUSES[];
  sortField?: OrdersSortField;
  sortOrder?: SortOrder;
}
