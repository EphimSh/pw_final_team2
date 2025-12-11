import {
  compareByCountryAsc,
  compareByCountryDesc,
  compareByCreatedOnAsc,
  compareByCreatedOnDesc,
  compareByNameAsc,
  compareByNameDesc,
} from "./comparatorCustomer.helper";

export const sortingCustomersData = [
  { sortField: "name", sortOrder: "asc", sorting: compareByNameAsc },
  { sortField: "name", sortOrder: "desc", sorting: compareByNameDesc },
  { sortField: "country", sortOrder: "asc", sorting: compareByCountryAsc },
  { sortField: "country", sortOrder: "desc", sorting: compareByCountryDesc },
  { sortField: "createdOn", sortOrder: "asc", sorting: compareByCreatedOnAsc },
  { sortField: "createdOn", sortOrder: "desc", sorting: compareByCreatedOnDesc },
];
