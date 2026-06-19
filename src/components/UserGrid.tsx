import { useMemo, useRef, useState, useCallback, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
  ModuleRegistry,
  AllCommunityModule,
  themeQuartz,
  type ColDef,
  type GridReadyEvent,
  type IDatasource,
  type IGetRowsParams,
} from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

import type { UserRow, GridFilters, GridSortParams } from '../types/index';
import userService from '../services/userService';
import { useApi } from '../hooks/useApi';
import { useNotification } from '../context/NotificationContext';
import { useDebounce, useLocalStorage } from '../hooks/useUtility';
import { FilterPanel } from './FilterPanel';
import { ConfirmDialog } from './ConfirmDialog';
import { GridSkeleton, ErrorState } from './GridStates';
import './user-grid.css';

ModuleRegistry.registerModules([AllCommunityModule]);

interface BulkDeleteState {
  isOpen: boolean;
  userIds: number[];
}

export default function UserGrid() {
  const gridRef = useRef<AgGridReact<UserRow>>(null);
  const { addNotification } = useNotification();

  // State management
  const [filters, setFilters] = useState<GridFilters>({});
  const [sortParams, setSortParams] = useState<GridSortParams>({});
  const [selectedRows, setSelectedRows] = useState<UserRow[]>([]);
  const [bulkDeleteState, setBulkDeleteState] = useState<BulkDeleteState>({ isOpen: false, userIds: [] });
  const [columnVisibility] = useLocalStorage<Record<string, boolean>>(
    'grid_column_visibility',
    {
      UserID: false,
      Employee_Code: true,
      Employee_Name: true,
      LoginID: true,
      Employee_Mobile: true,
      Department: true,
      Status: true,
      CreatedAt: false,
    }
  );

  // Debounced filters
  const debouncedFilters = useDebounce(filters, 300);

  // API calls
  const { loading, error, execute: executeLoad, reset } = useApi<any>();
  const {
    loading: deleteLoading,
    execute: executeDelete,
  } = useApi<void>();

  // Load data
  const loadData = useCallback(async () => {
    try {
      await executeLoad(async () => {
        const response = await userService.getUsers(debouncedFilters, sortParams, {
          pageNumber: 1,
          pageSize: 50,
        });

        if (gridRef.current?.api) {
          const datasource: IDatasource = {
            getRows(params: IGetRowsParams) {
              setTimeout(async () => {
                try {
                  const res = await userService.getUsers(debouncedFilters, sortParams, {
                    pageNumber: Math.floor(params.startRow / 20) + 1,
                    pageSize: 20,
                  });
                  params.successCallback(res.data, res.totalRecords);
                } catch {
                  params.failCallback();
                }
              }, 200);
            },
          };
          gridRef.current.api.setGridOption('datasource', datasource);
        }

        return response;
      });
    } catch (err) {
      addNotification('Failed to load users', 'error');
    }
  }, [debouncedFilters, sortParams, addNotification, executeLoad]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Column definitions
  const columnDefs = useMemo<ColDef<UserRow>[]>(() => {
    const columns: ColDef<UserRow>[] = [
      {
        field: 'UserID',
        headerName: 'ID',
        hide: !columnVisibility.UserID,
        width: 80,
      },
      {
        field: 'Employee_Code',
        headerName: 'Employee Code',
        hide: !columnVisibility.Employee_Code,
        sortable: true,
        filter: true,
        floatingFilter: true,
        resizable: true,
        flex: 1,
      },
      {
        field: 'Employee_Name',
        headerName: 'Employee Name',
        hide: !columnVisibility.Employee_Name,
        sortable: true,
        filter: true,
        floatingFilter: true,
        resizable: true,
        flex: 1,
      },
      {
        field: 'LoginID',
        headerName: 'Login ID',
        hide: !columnVisibility.LoginID,
        sortable: true,
        filter: true,
        floatingFilter: true,
        resizable: true,
        flex: 1,
      },
      {
        field: 'Employee_Mobile',
        headerName: 'Mobile',
        hide: !columnVisibility.Employee_Mobile,
        sortable: true,
        filter: true,
        floatingFilter: true,
        resizable: true,
        flex: 1,
      },
      {
        field: 'Department',
        headerName: 'Department',
        hide: !columnVisibility.Department,
        sortable: true,
        filter: true,
        floatingFilter: true,
        resizable: true,
        flex: 1,
      },
      {
        field: 'Status',
        headerName: 'Status',
        hide: !columnVisibility.Status,
        sortable: true,
        filter: true,
        floatingFilter: true,
        resizable: true,
        cellRenderer: (props: any) => (
          <span className={`status-badge status-${props.value?.toLowerCase()}`}>
            {props.value || '-'}
          </span>
        ),
        flex: 1,
      },
      {
        sortable: false,
        filter: false,
        resizable: false,
        width: 120,
        cellRenderer: (props: any) => (
          <div className="action-buttons">
            <button
              className="action-btn action-view"
              onClick={() => alert(`View details for ${props.data?.Employee_Name}`)}
              aria-label={`View ${props.data?.Employee_Name}`}
              title="View details"
            >
              👁️
            </button>
            <button
              className="action-btn action-edit"
              onClick={() => alert(`Edit ${props.data?.Employee_Name}`)}
              aria-label={`Edit ${props.data?.Employee_Name}`}
              title="Edit"
            >
              ✎
            </button>
            <button
              className="action-btn action-delete"
              onClick={() => handleDeleteClick(props.data?.UserID)}
              aria-label={`Delete ${props.data?.Employee_Name}`}
              title="Delete"
            >
              🗑️
            </button>
          </div>
        ),
        pinned: 'right',
      },
    ];

    return columns;
  }, [columnVisibility]);

  const defaultColDef = useMemo<ColDef>(
    () => ({
      flex: 1,
      sortable: true,
      filter: true,
      floatingFilter: true,
      resizable: true,
    }),
    []
  );

  const onGridReady = (event: GridReadyEvent) => {
    event.api.sizeColumnsToFit();
  };

  const onSelectionChanged = () => {
    const selected = gridRef.current?.api?.getSelectedRows() || [];
    setSelectedRows(selected);
  };

  const onSortChanged = (event: any) => {
    const sortModel = event.api.getState().sort;
    if (sortModel?.length > 0) {
      setSortParams({
        sortColumn: sortModel[0].colId,
        sortDirection: sortModel[0].sort as 'asc' | 'desc',
      });
    }
  };

  // Handlers
  const handleFilterChange = (newFilters: GridFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({});
  };

  const handleDeleteClick = (userId: number) => {
    setBulkDeleteState({
      isOpen: true,
      userIds: [userId],
    });
  };

  const handleBulkDelete = async () => {
    try {
      await executeDelete(() => userService.bulkDeleteUsers(bulkDeleteState.userIds));
      addNotification(`${bulkDeleteState.userIds.length} user(s) deleted successfully`, 'success');
      setBulkDeleteState({ isOpen: false, userIds: [] });
      setSelectedRows([]);
      loadData();
    } catch (err) {
      addNotification('Failed to delete users', 'error');
    }
  };

  const handleBulkDeleteSelected = () => {
    if (selectedRows.length === 0) {
      addNotification('Please select rows to delete', 'warning');
      return;
    }
    setBulkDeleteState({
      isOpen: true,
      userIds: selectedRows.map((r) => r.UserID),
    });
  };

  const handleExportCsv = () => {
    gridRef.current?.api?.exportDataAsCsv({
      fileName: `users_${new Date().toISOString().split('T')[0]}.csv`,
    });
    addNotification('CSV exported successfully', 'success');
  };

  const handleRefresh = () => {
    reset();
    loadData();
    addNotification('Data refreshed', 'info');
  };

  // Render
  if (loading) {
    return (
      <div className="user-grid-wrapper">
        <div className="grid-toolbar">
          <h2>User Master</h2>
        </div>
        <GridSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-grid-wrapper">
        <div className="grid-toolbar">
          <h2>User Master</h2>
        </div>
        <ErrorState error={error.message} onRetry={loadData} />
      </div>
    );
  }

  const activeFilterCount = Object.values(filters).filter((v) => v !== undefined && v !== '').length;

  return (
    <div className="user-grid-wrapper">
      <ConfirmDialog
        isOpen={bulkDeleteState.isOpen}
        title="Delete User(s)"
        message={`Are you sure you want to delete ${bulkDeleteState.userIds.length} user(s)? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous
        isLoading={deleteLoading}
        onConfirm={handleBulkDelete}
        onCancel={() => setBulkDeleteState({ isOpen: false, userIds: [] })}
      />

      <div className="grid-toolbar">
        <h2>User Master</h2>
        <div className="toolbar-actions">
          <FilterPanel
            filters={filters}
            onFiltersChange={handleFilterChange}
            onReset={handleResetFilters}
            activeFilterCount={activeFilterCount}
          />
          {selectedRows.length > 0 && (
            <button className="toolbar-btn toolbar-btn-danger" onClick={handleBulkDeleteSelected}>
              Delete Selected ({selectedRows.length})
            </button>
          )}
          <button className="toolbar-btn" onClick={handleRefresh}>
            ↻ Refresh
          </button>
          <button className="toolbar-btn" onClick={handleExportCsv}>
            ↓ Export CSV
          </button>
        </div>
      </div>

      <div className="ag-theme-quartz" style={{ width: '100%', height: '80vh' }}>
        <AgGridReact<UserRow>
          ref={gridRef}
          theme={themeQuartz}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowModelType="infinite"
          cacheBlockSize={20}
          maxBlocksInCache={5}
          rowSelection="multiple"
          onGridReady={onGridReady}
          onSelectionChanged={onSelectionChanged}
          onSortChanged={onSortChanged}
        />
      </div>
    </div>
  );
}
