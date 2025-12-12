export interface ID {
  _id: string;
}

export interface IResponseFields {
  IsSuccess: boolean;
  ErrorMessage: string | null;
}

export interface IRequestOptions {
  baseURL: string;
  url: string;
  method: "get" | "post" | "put" | "delete";
  data?: object | string;
  headers?: Record<string, string>;
}

export interface IResponse<T extends object | null> {
  status: number;
  headers: Record<string, string>;
  body: T;
}

export type SortOrder = "asc" | "desc";

export interface ICreatedOn {
  createdOn: string;
}
