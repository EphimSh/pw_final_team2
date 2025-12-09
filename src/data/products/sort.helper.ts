import { expect } from "@playwright/test";

export const expectArraySorted = <T>(items: T[], comparator: (a: T, b: T) => number) => {
  for (let i = 1; i < items.length; i++) {
    expect
      .soft(comparator(items[i - 1]!, items[i]!), `Array not sorted at index ${i - 1} -> ${i}`)
      .toBeLessThanOrEqual(0);
  }
};
