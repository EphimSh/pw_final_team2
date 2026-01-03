import { SALES_PORTAL_API_URL } from "./env";

export const apiConfig = {
  baseURL: SALES_PORTAL_API_URL,
  endpoints: {
    products: "/api/products",
    productById: (id: string) => `/api/products/${id}`,
    productsAll: "/api/products/all",
    login: "/api/login",
    customers: "/api/customers",
    customerById: (id: string) => `/api/customers/${id}`,
    customersAll: "/api/customers/all",
    orders: "/api/orders",
    ordersByCustomer: (id: string) => `/api/customers/${id}/orders`,
    orderComments: (id: string) => `/api/orders/${id}/comments`,
    orderCommentsById: (orderId: string, commentId: string) => `/api/orders/${orderId}/comments/${commentId}`,
    ordersDelivery: (id: string) => `/api/orders/${id}/delivery`,
    ordersReceived: (id: string) => `/api/orders/${id}/receive`,
    orderStatus: (id: string) => `/api/orders/${id}/status`,
    orderById: (id: string) => `/api/orders/${id}`,
    orderAssignManager: (orderId: string, managerId: string) => `/api/orders/${orderId}/assign-manager/${managerId}`,
    orderUnassignManager: (orderId: string) => `/api/orders/${orderId}/unassign-manager`,
    users: "/api/users",
    userById: (id: string) => `/api/users/${id}`,
    notifications: "/api/notifications",
    notificationsAll: "/api/notifications/mark-all-read",
    notificationById: (id: string) => `/api/notifications/${id}/read`,
  },
};
