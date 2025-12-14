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
    notifications: "/api/notifications",
    notificationsAll: "/api/notifications/mark-all-read",
    notificationById: (id: string) => `/api/notifications/${id}/read`,
    orders: "/api/orders",
    ordersByCustomer: (id: string) => `/api/customers/${id}/orders`,
    ordersDelivery: (id: string) => `/api/orders/${id}/delivery`,
    orderStatus: (id: string) => `/api/orders/${id}/status`,
    orderById: (id: string) => `/api/orders/${id}`,
  },
};
