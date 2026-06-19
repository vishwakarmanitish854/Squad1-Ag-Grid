import { useEffect, useMemo, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule, themeQuartz, type ColDef, type GridReadyEvent } from 'ag-grid-community';
import type { EnhancedGenericGridProps, SortParams } from '../types/GridProps';
import { useDebounce, useLocalStorage } from '../hooks/useUtility';
import { GridSkeleton, ErrorState, EmptyState } from './GridStates';
import '../styles/grid.css';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

ModuleRegistry.registerModules([AllCommunityModule]);

export default function GenericGrid<T extends Record<string, any>>({
  title,
  searchPlaceholder = 'Search...',
  columns,
  summaryCards = [],
  actions = [],
  serverDataSource,
  onSortChanged,
  pageSize: initialPageSize = 10,
  enableColumnSelection = true,
  enableRowSelection = true,
  enableExport = true,
}: EnhancedGenericGridProps<T>) {
  const gridApiRef = useRef<any>(null);
  const loadingRef = useRef(false);

  // State - minimal
  const [searchText, setSearchText] = useState('');
  const debouncedSearch = useDebounce(searchText, 300);
  const [pagination, setPagination] = useState({ pageNumber: 1, pageSize: initialPageSize });
  const [sortParams, setSortParams] = useState<SortParams>({});
  const [selectedRows, setSelectedRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gridData, setGridData] = useState<T[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [showColumns, setShowColumns] = useState(false);

  // Column visibility
  const [columnVisibility, setColumnVisibility] = useLocalStorage(
    `grid_${title}_columns`,
    Object.fromEntries(columns.map((col) => [col.field as string, true]))
  );

  const selectedColumns = useMemo(
    () =>
      columns
        .filter((col) => columnVisibility[col.field as string] !== false)
        .map((col) => col.field as string),
    [columns, columnVisibility]
  );

  // Load data - simpler logic
  useEffect(() => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);

    (async () => {
      try {
        setError(null);

        if (serverDataSource) {
          const response = await serverDataSource(pagination, sortParams, { search: debouncedSearch });
          setGridData(response.data);
          setTotalRecords(response.totalRecords);
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to load data';
        setError(msg);
      } finally {
        setLoading(false);
        loadingRef.current = false;
      }
    })();
  }, [pagination, sortParams, debouncedSearch, serverDataSource]);

  // Column definitions
  const finalColumns = useMemo<ColDef<T>[]>(() => {
    let cols = columns.filter((col) =>
      selectedColumns.includes(col.field as string)
    ) as ColDef<T>[];

    if (enableRowSelection) {
      cols = [
        {
          checkboxSelection: true,
          headerCheckboxSelection: true,
          width: 50,
          sortable: false,
          filter: false,
          suppressMenu: true,
        } as ColDef<T>,
        ...cols,
      ];
    }

    if (actions.length > 0) {
      cols.push({
        headerName: 'Actions',
        width: 100 + actions.length * 70,
        sortable: false,
        filter: false,
        cellRenderer: (props: any) => (
          <div style={{ display: 'flex', gap: '8px' }}>
            {actions.map((action) => (
              <button
                key={action.label}
                className="action-btn-default"
                onClick={() => action.onClick(props.data)}
              >
                {action.label}
              </button>
            ))}
          </div>
        ),
        pinned: 'right',
      } as ColDef<T>);
    }

    return cols;
  }, [columns, selectedColumns, actions, enableRowSelection]);

  // Event handlers
  const handleSearch = (value: string) => {
    setSearchText(value);
    setPagination({ pageNumber: 1, pageSize: pagination.pageSize });
  };

  const handlePageChange = (pageNumber: number) => {
    setPagination((prev) => ({ ...prev, pageNumber }));
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPagination({ pageNumber: 1, pageSize: newPageSize });
  };

  const handleSortChanged = (event: any) => {
    const sortModel = event.api.getState().sort;
    if (sortModel?.length > 0) {
      setSortParams({
        sortColumn: sortModel[0].colId,
        sortDirection: sortModel[0].sort,
      });
      setPagination({ pageNumber: 1, pageSize: pagination.pageSize });
      onSortChanged?.(sortModel[0]);
    }
  };

  const handleExportCSV = () => {
    gridApiRef.current?.exportDataAsCsv({
      fileName: `${title}_${new Date().toISOString().split('T')[0]}.csv`,
    });
  };

  const handleRefresh = () => {
    loadingRef.current = false;
  };

  const totalPages = Math.ceil(totalRecords / pagination.pageSize);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">{title}</h1>
        <p className="page-subtitle">Enterprise Generic Grid with Server-side Pagination</p>
      </div>

      {summaryCards.length > 0 && (
        <div className="summary-container">
          {summaryCards.map((card) => (
            <div className="summary-card" key={card.title}>
              <h4>{card.title}</h4>
              <h2>{card.value}</h2>
            </div>
          ))}
          <div className="summary-card">
            <h4>Selected Rows</h4>
            <h2>{selectedRows.length}</h2>
          </div>
          <div className="summary-card">
            <h4>Total Records</h4>
            <h2>{totalRecords}</h2>
          </div>
        </div>
      )}

      <div className="grid-card">
        <div className="toolbar">
          <div className="toolbar-left">
            <input
              className="search-box"
              placeholder={searchPlaceholder}
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <div className="toolbar-right">
            {enableExport && (
              <button className="btn btn-primary" onClick={handleExportCSV}>
                📥 Export
              </button>
            )}
            <button className="btn btn-success" onClick={handleRefresh}>
              🔄 Refresh
            </button>
            {enableColumnSelection && (
              <button className="btn btn-secondary" onClick={() => setShowColumns(!showColumns)}>
                ⚙️ Columns
              </button>
            )}
          </div>
        </div>

        {showColumns && (
          <div className="column-selector">
            <strong>Columns</strong>
            <br />
            <br />
            {columns.map((col) => (
              <label key={col.field as string}>
                <input
                  type="checkbox"
                  checked={selectedColumns.includes(col.field as string)}
                  onChange={() =>
                    setColumnVisibility({
                      ...columnVisibility,
                      [col.field as string]: !columnVisibility[col.field as string],
                    })
                  }
                />
                {col.headerName || col.field}
              </label>
            ))}
          </div>
        )}

        {loading && <GridSkeleton />}
        {error && <ErrorState error={error} onRetry={handleRefresh} />}
        {!loading && !error && gridData.length === 0 && <EmptyState />}

        {!loading && !error && gridData.length > 0 && (
          <>
            <div className="ag-theme-quartz" style={{ width: '100%', height: 'calc(100vh - 420px)', minHeight: '500px' }}>
              <AgGridReact<T>
                ref={gridApiRef}
                theme={themeQuartz}
                rowData={gridData}
                columnDefs={finalColumns}
                pagination={false}
                rowSelection={enableRowSelection ? 'multiple' : undefined}
                rowHeight={45}
                headerHeight={50}
                animateRows
                onGridReady={(params: GridReadyEvent) => {
                  gridApiRef.current = params.api;
                  setTimeout(() => params.api.sizeColumnsToFit(), 100);
                }}
                onSelectionChanged={() => setSelectedRows(gridApiRef.current?.getSelectedRows() || [])}
                onSortChanged={handleSortChanged}
              />
            </div>

            {totalPages > 1 && (
              <div className="pagination-controls">
                <div className="pagination-info">
                  Showing {gridData.length} of {totalRecords} records
                </div>
                <div className="pagination-buttons">
                  <button disabled={pagination.pageNumber === 1} onClick={() => handlePageChange(1)}>
                    « First
                  </button>
                  <button
                    disabled={pagination.pageNumber === 1}
                    onClick={() => handlePageChange(pagination.pageNumber - 1)}
                  >
                    ‹ Prev
                  </button>
                  <span className="page-info">
                    Page {pagination.pageNumber} of {totalPages}
                  </span>
                  <button
                    disabled={pagination.pageNumber >= totalPages}
                    onClick={() => handlePageChange(pagination.pageNumber + 1)}
                  >
                    Next ›
                  </button>
                  <button
                    disabled={pagination.pageNumber >= totalPages}
                    onClick={() => handlePageChange(totalPages)}
                  >
                    Last »
                  </button>
                </div>
                <select value={pagination.pageSize} onChange={(e) => handlePageSizeChange(Number(e.target.value))}>
                  {[5, 10, 25, 50, 100].map((size) => (
                    <option key={size} value={size}>
                      {size} per page
                    </option>
                  ))}
                </select>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
