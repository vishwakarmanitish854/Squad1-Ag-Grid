import type { ColDef } from 'ag-grid-community';

export interface GridAction {
  label: string;
  className?: string;
  onClick: (row: any) => void;
}

export interface SummaryCard {
  title: string;
  value: number | string;
}

// Pagination
export interface PaginationParams {
  pageNumber: number;
  pageSize: number;
}

// Sorting
export interface SortParams {
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
}

// Server-side data response
export interface ServerDataResponse<T> {
  data: T[];
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
}

// Server data source function
export type ServerDataSource<T> = (
  pagination: PaginationParams,
  sort: SortParams,
  filters: Record<string, any>
) => Promise<ServerDataResponse<T>>;

// Original GenericGridProps (backward compatible)
export interface GenericGridProps {
  title: string;
  searchPlaceholder?: string;
  data: any[];
  columns: ColDef[];
  summaryCards?: SummaryCard[];
  actions?: GridAction[];
}

// New enhanced GenericGridProps with server-side support
export interface EnhancedGenericGridProps<T = any> {
  title: string;
  searchPlaceholder?: string;
  columns: ColDef<T>[];
  summaryCards?: SummaryCard[];
  actions?: GridAction[];
  // Server-side data source (alternative to static data)
  serverDataSource?: ServerDataSource<T>;
  // Static data (for client-side pagination)
  data?: T[];
  // Callbacks
  onRowSelected?: (rows: T[]) => void;
  onSortChanged?: (sort: SortParams) => void;
  onFiltersChanged?: (filters: Record<string, any>) => void;
  // Configuration
  pageSize?: number;
  enableColumnSelection?: boolean;
  enableRowSelection?: boolean;
  enableExport?: boolean;
  autoLoad?: boolean;
}
