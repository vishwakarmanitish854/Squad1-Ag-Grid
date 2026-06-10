import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { AgGridReact } from "ag-grid-react";

import {
  ModuleRegistry,
  AllCommunityModule,
} from "ag-grid-community";

import type {
  GridApi,
  ColDef,
} from "ag-grid-community";

import type {
  GenericGridProps,
} from "../types/GridProps";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

import "../styles/grid.css";

ModuleRegistry.registerModules([
  AllCommunityModule,
]);

export default function GenericGrid({
  title,
  searchPlaceholder = "Search...",
  data,
  columns,
  summaryCards = [],
  actions = [],
}: GenericGridProps) {
  const gridApiRef =
    useRef<GridApi | null>(null);

  const [searchText, setSearchText] =
    useState("");

  const [
    selectedRowsCount,
    setSelectedRowsCount,
  ] = useState(0);

  const [showColumns, setShowColumns] =
    useState(false);

  const [
    selectedColumns,
    setSelectedColumns,
  ] = useState(
    columns
      .filter(
        (x: any) => x.field
      )
      .map(
        (x: any) =>
          x.field as string
      )
  );

  const finalColumns =
    useMemo<ColDef[]>(() => {
      const visibleColumns =
        columns.filter((col) =>
          selectedColumns.includes(
            col.field as string
          )
        );

      const actionColumn: ColDef =
        {
          headerName: "Actions",

          field: "actions",

          width: 220,

          sortable: false,

          filter: false,

          pinned: "right",

          cellRenderer: (
            params: any
          ) => (
            <div
              style={{
                display: "flex",
                gap: "5px",
              }}
            >
              {actions.map(
                (action) => (
                  <button
                    key={
                      action.label
                    }
                    className={
                      action.className
                    }
                    onClick={() =>
                      action.onClick(
                        params.data
                      )
                    }
                  >
                    {
                      action.label
                    }
                  </button>
                )
              )}
            </div>
          ),
        };

      return [
        ...visibleColumns,

        ...(actions.length
          ? [actionColumn]
          : []),
      ];
    }, [
      columns,
      selectedColumns,
      actions,
    ]);

  const onSearch = (
    value: string
  ) => {
    setSearchText(value);

    gridApiRef.current?.setGridOption(
      "quickFilterText",
      value
    );
  };

  const exportCSV = () => {
    gridApiRef.current?.exportDataAsCsv();
  };

  const refreshGrid = () => {
    gridApiRef.current?.refreshCells();
  };

  useEffect(() => {
    const resizeHandler = () => {
      gridApiRef.current?.sizeColumnsToFit();
    };

    window.addEventListener(
      "resize",
      resizeHandler
    );

    return () =>
      window.removeEventListener(
        "resize",
        resizeHandler
      );
  }, []);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">
          {title}
        </h1>

        <p className="page-subtitle">
          Enterprise Generic Grid
        </p>
      </div>

      <div className="summary-container">
        {summaryCards.map(
          (card) => (
            <div
              className="summary-card"
              key={card.title}
            >
              <h4>
                {card.title}
              </h4>

              <h2>
                {card.value}
              </h2>
            </div>
          )
        )}

        <div className="summary-card">
          <h4>
            Selected Rows
          </h4>

          <h2>
            {selectedRowsCount}
          </h2>
        </div>
      </div>

      <div className="grid-card">
        <div className="toolbar">
          <div className="toolbar-left">
            <input
              className="search-box"
              placeholder={
                searchPlaceholder
              }
              value={searchText}
              onChange={(e) =>
                onSearch(
                  e.target.value
                )
              }
            />
          </div>

          <div className="toolbar-right">
            <button
              className="btn btn-primary"
              onClick={exportCSV}
            >
              Export CSV
            </button>

            <button
              className="btn btn-success"
              onClick={refreshGrid}
            >
              Refresh
            </button>

            <button
              className="btn btn-secondary"
              onClick={() =>
                setShowColumns(
                  !showColumns
                )
              }
            >
              Columns
            </button>
          </div>
        </div>

        {showColumns && (
          <div className="column-selector">
            <strong>
              Select Columns
            </strong>

            <br />
            <br />

            {columns.map(
              (col) => (
                <label
                  key={
                    col.field as string
                  }
                >
                  <input
                    type="checkbox"
                    checked={selectedColumns.includes(
                      col.field as string
                    )}
                    onChange={(
                      e
                    ) => {
                      if (
                        e.target
                          .checked
                      ) {
                        setSelectedColumns(
                          [
                            ...selectedColumns,
                            col.field as string,
                          ]
                        );
                      } else {
                        setSelectedColumns(
                          selectedColumns.filter(
                            (
                              x
                            ) =>
                              x !==
                              col.field
                          )
                        );
                      }
                    }}
                  />

                  {col.headerName}
                </label>
              )
            )}
          </div>
        )}

        <div
          className="ag-theme-quartz"
          style={{
            width: "100%",
            height:
              "calc(100vh - 320px)",
            minHeight: "650px",
          }}
        >
          <AgGridReact
            rowData={data}
            columnDefs={
              finalColumns
            }
            pagination={true}
            paginationPageSize={10}
            paginationPageSizeSelector={[
              10,
              25,
              50,
              100,
            ]}
            rowHeight={45}
            headerHeight={50}
            animateRows={true}
            rowSelection={{
              mode:
                "multiRow",
            }}
            defaultColDef={{
              sortable: true,
              filter: true,
              resizable: true,
              floatingFilter: true,
            }}
            onSelectionChanged={() => {
              const rows =
                gridApiRef.current?.getSelectedRows();

              setSelectedRowsCount(
                rows?.length || 0
              );
            }}
            onGridReady={(
              params
            ) => {
              gridApiRef.current =
                params.api;

              setTimeout(() => {
                params.api.sizeColumnsToFit();
              }, 100);
            }}
          />
        </div>
      </div>
    </div>
  );
}