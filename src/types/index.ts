export interface UserRow {
  UserID: number;
  Employee_Code: string;
  Employee_Name: string;
  LoginID: string;
  Employee_Mobile: string;
  Department?: string;
  Status?: 'active' | 'inactive' | 'on-leave';
  CreatedAt?: string;
  UpdatedAt?: string;
  CreatedBy?: string;
  UpdatedBy?: string;
}

export interface GridFilters {
  searchText?: string;
  Department?: string;
  Status?: 'active' | 'inactive' | 'on-leave';
  dateFrom?: string;
  dateTo?: string;
  Employee_Code?: string;
}

export interface GridSortParams {
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface GridPaginationParams {
  pageNumber: number;
  pageSize: number;
}

export interface ApiResponse<T> {
  data: T[];
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface ColumnConfig {
  field: string;
  headerName: string;
  visible: boolean;
  order: number;
  width?: number;
  frozen?: boolean;
}

export interface BulkActionParams {
  userIds: number[];
  action: 'delete' | 'archive' | 'status-update';
  metadata?: Record<string, unknown>;
}

export interface AuditLog {
  id: string;
  userId: number;
  action: string;
  entityType: string;
  entityId: number;
  changes: Record<string, { oldValue: unknown; newValue: unknown }>;
  timestamp: string;
  userEmail?: string;
}

export interface PermissionSet {
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canExport: boolean;
  canBulkEdit: boolean;
  visibleFields: string[];
}
