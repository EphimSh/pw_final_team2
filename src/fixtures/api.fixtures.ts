import { test as base, expect } from "@playwright/test";
import { ProductsApi } from "api/api/products.api";
import { LoginApi } from "api/api/login.api";
import { LoginService } from "api/service/login.service";
import { ProductsApiService } from "api/service/products.service";
import { CustomersApi } from "api/api/customers.api";
import { CustomersApiService } from "api/service/customers.service";
import { NotificationApi } from "api/api/notifications.api";
import { NotificationsApiService } from "api/service/notification.service";
import { PlaywrightApiClient } from "api/apiClients/PWApiClient";
import { OrdersApi } from "api/api/orders.api";
import { OrdersApiService } from "api/service/orders.service";
import { UsersApi } from "api/api/users.api";
import { UsersApiService } from "api/service/users.service";

export interface IApi {
  // api
  productsApi: ProductsApi;
  loginApi: LoginApi;
  customerApi: CustomersApi;
  notificationApi: NotificationApi;
  ordersApi: OrdersApi;
  usersApi: UsersApi;

  //services
  productsApiService: ProductsApiService;
  loginApiService: LoginService;
  customerApiService: CustomersApiService;
  notificationApiService: NotificationsApiService;
  ordersApiService: OrdersApiService;
  usersApiService: UsersApiService;
}

const test = base.extend<IApi>({
  //api
  productsApi: async ({ request }, use) => {
    const apiClient = new PlaywrightApiClient(request);
    const api = new ProductsApi(apiClient);
    await use(api);
  },

  loginApi: async ({ request }, use) => {
    const apiClient = new PlaywrightApiClient(request);
    const api = new LoginApi(apiClient);
    await use(api);
  },

  customerApi: async ({ request }, use) => {
    const apiClient = new PlaywrightApiClient(request);
    const api = new CustomersApi(apiClient);
    await use(api);
  },

  notificationApi: async ({ request }, use) => {
    const apiClient = new PlaywrightApiClient(request);
    const api = new NotificationApi(apiClient);
    await use(api);
  },

  ordersApi: async ({ request }, use) => {
    const apiClient = new PlaywrightApiClient(request);
    const api = new OrdersApi(apiClient);
    await use(api);
  },

  usersApi: async ({ request }, use) => {
    const apiClient = new PlaywrightApiClient(request);
    const api = new UsersApi(apiClient);
    await use(api);
  },

  //services
  productsApiService: async ({ productsApi }, use) => {
    await use(new ProductsApiService(productsApi));
  },

  loginApiService: async ({ loginApi }, use) => {
    await use(new LoginService(loginApi));
  },

  customerApiService: async ({ customerApi }, use) => {
    await use(new CustomersApiService(customerApi));
  },

  ordersApiService: async ({ ordersApi, customerApiService, productsApiService }, use) => {
    await use(new OrdersApiService(ordersApi, customerApiService, productsApiService));
  },

  usersApiService: async ({ usersApi }, use) => {
    await use(new UsersApiService(usersApi));
  },
});

export { test, expect };
