import { IApiClient } from "api/apiClients/types";
import { apiConfig } from "config/apiConfig";
import { IRequestOptions } from "data/types/core.types";
import { IUserCreateBody, IUserResponse, IUsersResponse } from "data/types/user.types";

export class UsersApi {
  constructor(private apiClient: IApiClient) {}

  // ("POST /api/users")
  async create(userData: IUserCreateBody, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints.users,
      method: "post",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: userData,
    };

    try {
      return await this.apiClient.send<IUserResponse>(options);
    } catch (error) {
      console.error(`Failed to create user ${userData.username}:`, error);
      throw error;
    }
  }

  // ("GET /api/users")
  async getAll(token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints.users,
      method: "get",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      return await this.apiClient.send<IUsersResponse>(options);
    } catch (error) {
      console.error("Failed to get users:", error);
      throw error;
    }
  }

  // ("DELETE /api/users/{id}")
  async delete(id: string, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints.userById(id),
      method: "delete",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      return await this.apiClient.send<null>(options);
    } catch (error) {
      console.error(`Failed to delete user ${id}:`, error);
      throw error;
    }
  }
}
