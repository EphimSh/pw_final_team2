export interface IUserInfo {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  roles: ROLES[];
  createdOn: string;
}

export enum ROLES {
  ADMIN = "ADMIN",
  USER = "USER",
}

export interface IUserCreateBody {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface IUserResponse {
  User: IUserInfo;
  IsSuccess: boolean;
  ErrorMessage: string | null;
}

export interface IUsersResponse {
  Users: IUserInfo[];
  IsSuccess: boolean;
  ErrorMessage: string | null;
}
