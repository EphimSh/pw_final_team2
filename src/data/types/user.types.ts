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
