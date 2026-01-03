import { faker } from "@faker-js/faker";
import { IUserCreateBody } from "data/types/user.types";

export function generateManagerData(params?: Partial<IUserCreateBody>): IUserCreateBody {
  const suffix = faker.string.alphanumeric({ length: 8 });
  const username = `testmanager_${suffix}`;
  const managerData: IUserCreateBody = {
    username,
    password: username,
    firstName: `Manager${suffix}`,
    lastName: `Manager${suffix}`,
  };
  return {
    ...managerData,
    ...params,
  };
}
