import { expect, Page } from "@playwright/test";
import { apiConfig } from "config/apiConfig";
import { generateCustomerData } from "data/customers/generateCustomerData";
import { STATUS_CODES } from "data/statusCode";

import { ICustomer, ICustomerResponse } from "data/types/customers.types";
import _ from "lodash";
import { AddNewCustomerPage, CustomersListPage } from "ui/pages/customers";
import { logStep } from "utils/report/logStep.utils";

export class AddNewCustomerUIService {
  addNewCustomerPage: AddNewCustomerPage;
  customersListPage: CustomersListPage;
  constructor(private page: Page) {
    this.addNewCustomerPage = new AddNewCustomerPage(page);
    this.customersListPage = new CustomersListPage(page);
  }

  @logStep("Open Add New Customer page")
  async open() {
    await this.addNewCustomerPage.open("customers/add");
    await this.addNewCustomerPage.waitForOpened();
  }

  @logStep("Create new customer via UI")
  async create(customerData?: Partial<ICustomer>) {
    const data = generateCustomerData(customerData);
    await this.addNewCustomerPage.fillForm(data);
    const response = await this.addNewCustomerPage.interceptResponse<ICustomerResponse, []>(
      apiConfig.endpoints.customers,
      this.addNewCustomerPage.clickSave.bind(this.addNewCustomerPage),
    );
    expect(response.status).toBe(STATUS_CODES.CREATED);
    expect(_.omit(response.body.Customer, "_id", "createdOn")).toEqual(data);

    await this.customersListPage.waitForOpened();
    return response.body.Customer;
  }
}
