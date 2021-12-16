export interface DataList<T> {
  page: number;
  size: number;
  total: number;
  data: T[]
}

export interface ResponseSearch<T> {
  total: number;
  items: T[]
}
