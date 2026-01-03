import { UsersApi } from "api/api/users.api";
import { createUserSchema, getAllUsersSchema } from "data/schemas/users";
import { STATUS_CODES } from "data/statusCode";
import { IUserCreateBody } from "data/types/user.types";
import { validateResponse } from "utils/validation/validateResponse.utils";

export class UsersApiService {
  constructor(private usersApi: UsersApi) {}

  async create(token: string, userData: IUserCreateBody) {
    const response = await this.usersApi.create(userData, token);
    validateResponse(response, {
      status: STATUS_CODES.CREATED,
      IsSuccess: true,
      ErrorMessage: null,
      schema: createUserSchema,
    });
    return response.body.User;
  }

  async getAll(token: string) {
    const response = await this.usersApi.getAll(token);
    validateResponse(response, {
      status: STATUS_CODES.OK,
      IsSuccess: true,
      ErrorMessage: null,
      schema: getAllUsersSchema,
    });
    return response.body.Users;
  }

  async delete(token: string, id: string) {
    const response = await this.usersApi.delete(id, token);
    validateResponse(response, {
      status: STATUS_CODES.DELETED,
    });
  }
}
