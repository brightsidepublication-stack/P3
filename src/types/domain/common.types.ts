export type UUID = string;

export type ISODateString = string;

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonObject
  | JsonValue[];

export interface JsonObject {
  [key: string]: JsonValue;
}

export interface Timestamps {
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
}

export interface PaginatedResult<T> {
  items: T[];
  pagination: Pagination;
}