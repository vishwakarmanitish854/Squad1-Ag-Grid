export interface GridRequest {
  pageNumber: number;
  pageSize: number;
  searchText: string;
  sortColumn: string;
  sortDirection: string;
}

export interface GridResponse<T> {
  data: T[];
  totalRecords: number;
}