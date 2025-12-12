import { test as api } from "./api.fixtures";
import { mergeTests, expect } from "@playwright/test";

const test = mergeTests(api);

export { test, expect };
