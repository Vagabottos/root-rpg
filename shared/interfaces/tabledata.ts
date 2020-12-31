
export interface ITableData<T> {
  total: number;
  limit: number;
  skip: number;
  data: T[];
}
