import { sortingCustomersData } from "data/customers/sortingCustomersData";
import { getSortedSchema } from "data/schemas/customers/getSorted.schema";
import { STATUS_CODES } from "data/statusCode";
import { SortOrder } from "data/types/core.types";
import { CustomersTableHeader, ICustomerFromResponse } from "data/types/customers.types";
import { TEST_TAG, COMPONENT_TAG } from "data/types/tags.types";
import { expect, test } from "fixtures/api.fixtures";
import { validateResponse } from "utils/validation/validateResponse.utils";

test.skip("[API] [Sales Portal] [Customers] [Get Sorted]", () => {
  test.describe.configure({ timeout: 90_000 });

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
      test(
        `Search Customers by ${option}`,
        { tag: [TEST_TAG.REGRESSION, COMPONENT_TAG.CUSTOMERS, COMPONENT_TAG.SEARCH] },
        async ({ customerApi, customerApiService }) => {
          const searchField = customer1[option as keyof ICustomerFromResponse] as string;
          const response = await customerApi.getSorted(token, {
            search: searchField,
          });

          validateResponse(response, {
            status: STATUS_CODES.OK,
            IsSuccess: true,
            ErrorMessage: null,
          });

          await customerApiService.assertProductInSortedList(response, {
            customer: customer1,
            searchField: searchField,
          });
        },
      );
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
        customerApiService,
      }) => {
        const sortingField = sortOption.sortField as CustomersTableHeader;
        const sortingOrder = sortOption.sortOrder as SortOrder;
        const getSortedResponse = await customerApi.getSorted(token, {
          sortField: sortingField,
          sortOrder: sortingOrder,
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

        await customerApiService.assertProductInSortedList(getSortedResponse, {
          sortField: sortingField,
          sortOrder: sortingOrder,
          minCustomersTotal: 2, // because i have min 2 customers created
        });
      });
    }
  });
});
