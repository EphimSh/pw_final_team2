import { test as api } from "./api.fixtures";
import { test as ui } from "./pages.fixture";
import { mergeTests, expect } from "@playwright/test";

const test = mergeTests(api, ui);

export { test, expect };
