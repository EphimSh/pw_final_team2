import {
  test as base,
  expect,
  // Page
} from "@playwright/test";
import { HomePage } from "ui/pages/home.page";
import { LoginPage } from "ui/pages/login.page";
import { AddNewProductPage } from "ui/pages/products/addNewProduct.page";
import { ProductsListPage } from "ui/pages/products/productsList.page";

import { EditProductPage } from "ui/pages/products/editProduct.page";

import { CustomersListPage } from "ui/pages/customers/customersList.page";
import { AddNewCustomerPage } from "ui/pages/customers/addNewCustomer.page";
import { HomeUIService } from "ui/service/home.ui-service";
import { ProductsListUIService } from "ui/service/productsList.ui-service";
import { LoginUIService } from "ui/service/login.ui-service";
import { AddNewCustomerUIService } from "ui/service/addNewCustomer.ui.service";
import { AddNewProductUIService } from "ui/service/addNewProduct.ui-service";
import { AddNewOrderPage, OrderPage, OrdersListPage } from "ui/pages/orders";
import { AddNewOrderUIService } from "ui/service/addNewOrder.ui.service";
import { OrderUIService } from "ui/service/order.ui-service";
import { ScheduleDeliveryPage } from "ui/pages/orders/scheduleDelivery.page";

export interface IPages {
  //pages
  loginPage: LoginPage;
  homePage: HomePage;
  productsListPage: ProductsListPage;
  addNewProductPage: AddNewProductPage;
  editProductPage: EditProductPage;
  customersListPage: CustomersListPage;
  addNewCustomerPage: AddNewCustomerPage;
  ordersListPage: OrdersListPage;
  addNewOrderPage: AddNewOrderPage;
  orderPage: OrderPage;
  scheduleDeliveryPage: ScheduleDeliveryPage;

  //ui-services
  homeUIService: HomeUIService;
  productsListUIService: ProductsListUIService;
  addNewProductUIService: AddNewProductUIService;
  loginUIService: LoginUIService;
  addNewCustomerUIService: AddNewCustomerUIService;
  addNewOrderUIService: AddNewOrderUIService;
  orderUIService: OrderUIService;
}

export const test = base.extend<IPages>({
  //pages
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  productsListPage: async ({ page }, use) => {
    await use(new ProductsListPage(page));
  },
  addNewProductPage: async ({ page }, use) => {
    await use(new AddNewProductPage(page));
  },
  editProductPage: async ({ page }, use) => {
    await use(new EditProductPage(page));
  },
  customersListPage: async ({ page }, use) => {
    await use(new CustomersListPage(page));
  },
  addNewCustomerPage: async ({ page }, use) => {
    await use(new AddNewCustomerPage(page));
  },
  ordersListPage: async ({ page }, use) => {
    await use(new OrdersListPage(page));
  },
  addNewOrderPage: async ({ page }, use) => {
    await use(new AddNewOrderPage(page));
  },
  orderPage: async ({ page }, use) => {
    await use(new OrderPage(page));
  },
  scheduleDeliveryPage: async ({ page }, use) => {
    await use(new ScheduleDeliveryPage(page));
  },

  //ui-services
  homeUIService: async ({ page }, use) => {
    await use(new HomeUIService(page));
  },

  productsListUIService: async ({ page }, use) => {
    await use(new ProductsListUIService(page));
  },

  addNewProductUIService: async ({ page }, use) => {
    await use(new AddNewProductUIService(page));
  },

  loginUIService: async ({ page }, use) => {
    await use(new LoginUIService(page));
  },
  addNewCustomerUIService: async ({ page }, use) => {
    await use(new AddNewCustomerUIService(page));
  },
  addNewOrderUIService: async ({ page }, use) => {
    await use(new AddNewOrderUIService(page));
  },
  orderUIService: async ({ page }, use) => {
    await use(new OrderUIService(page));
  },
});

export { expect };
