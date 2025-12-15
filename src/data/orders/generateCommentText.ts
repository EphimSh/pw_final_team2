import { faker } from "@faker-js/faker";

export function generateCommentText(length?: number): string {
  return faker.string.alphanumeric({ length: length ?? { min: 1, max: 250 } });
}
