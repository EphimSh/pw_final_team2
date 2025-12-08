import { sortingCustomersData } from "data/customers/sortingCustomersData";
import { getSortedSchema } from "data/schemas/customers/getSorted.schema";
import { STATUS_CODES } from "data/statusCode";
import { SortOrder } from "data/types/core.types";
import { CustomersTableHeader, ICustomerFromResponse } from "data/types/customers.types";
import { expect, test } from "fixtures/api.fixtures";
import { validateResponse } from "utils/validation/validateResponse.utils";

test.describe("[API] [Sales Portal] [Customers] [Get Sorted]", () => {
  test.describe("Search", () => {
    const ids: string[] = [];
    let token = "";
    let customer1: ICustomerFromResponse;

    test.beforeAll(async ({ loginApiService, customerApiService }) => {
      token = await loginApiService.loginAsAdmin();
      customer1 = await customerApiService.create(token);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const customer2 = await customerApiService.create(token);
      ids.push(customer1._id, customer2._id);
    });

    test.afterAll(async ({ customerApiService }) => {
      if (ids.length) {
        for (const id of ids) {
          await customerApiService.delete(token, id);
        }
        ids.length = 0;
      }
    });

    const searchOprions = ["name", "email", "country"];

    for (const option of searchOprions) {
      test(`Search Customers by ${option}`, async ({ customerApi }) => {
        const searchField = customer1[option as keyof ICustomerFromResponse] as string;
        const response = await customerApi.getSorted(token, {
          search: searchField,
        });

        validateResponse(response, {
          status: STATUS_CODES.OK,
          IsSuccess: true,
          ErrorMessage: null,
        });

        const { limit, search, country, total, page, sorting } = response.body;
        const found = response.body.Customers.find((el) => el._id === customer1._id);
        expect.soft(found, `Created customer should be in response`).toBeTruthy();
        expect.soft(limit, `Limit should be ${limit}`).toBe(10);
        expect.soft(search).toBe(searchField);
        expect.soft(country).toEqual([]);
        expect.soft(page).toBe(1);
        expect.soft(sorting).toEqual({ sortField: "createdOn", sortOrder: "desc" });
        expect.soft(total).toBeGreaterThanOrEqual(1);
      });
    }
  });

  test.describe("Sorting", () => {
    test.describe.configure({ mode: "serial" });

    const ids: string[] = [];
    let token = "";

    test.beforeAll(async ({ loginApiService, customerApiService }) => {
      token = await loginApiService.loginAsAdmin();

      const customer1 = await customerApiService.create(token);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const customer2 = await customerApiService.create(token);
      ids.push(customer1._id, customer2._id);
    });

    test.afterAll(async ({ customerApiService }) => {
      if (ids.length) {
        for (const id of ids) {
          await customerApiService.delete(token, id);
        }
        ids.length = 0;
      }
    });

    for (const sortOption of sortingCustomersData) {
      test(`Sort by: SortField: ${sortOption.sortField}, sortOrder: ${sortOption.sortOrder}`, async ({
        customerApi,
      }) => {
        const getSortedResponse = await customerApi.getSorted(token, {
          sortField: sortOption.sortField as CustomersTableHeader,
          sortOrder: sortOption.sortOrder as SortOrder,
        });

        const actualCustomers = getSortedResponse.body.Customers;
        validateResponse(getSortedResponse, {
          status: STATUS_CODES.OK,
          IsSuccess: true,
          ErrorMessage: null,
          schema: getSortedSchema,
        });

        const allCustomersResponse = await customerApi.getAll(token);
        const allCustomerSorted = allCustomersResponse.body.Customers.toSorted(sortOption.sorting);

        validateResponse(allCustomersResponse, {
          status: STATUS_CODES.OK,
          IsSuccess: true,
          ErrorMessage: null,
        });

        actualCustomers.forEach((actual, index) => {
          expect.soft(actual).toEqual(allCustomerSorted[index]);
        });

        const { limit, search, country, total, page, sorting } = getSortedResponse.body;
        expect.soft(limit, `Limit should be ${limit}`).toBe(10);
        expect.soft(search).toBe("");
        expect.soft(country).toEqual([]);
        expect.soft(page).toBe(1);
        expect.soft(sorting).toEqual({ sortField: sortOption.sortField, sortOrder: sortOption.sortOrder });
        expect.soft(total).toBeGreaterThanOrEqual(2);
      });
    }
  });
});
