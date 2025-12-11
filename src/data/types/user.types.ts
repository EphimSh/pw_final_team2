export interface IUserInfo {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  roles: ROLES[]; // Или enum, если есть фиксированные роли
  createdOn: string; // Лучше ISO-строка
}

export enum ROLES {
  ADMIN = "ADMIN",
  USER = "USER",
}
