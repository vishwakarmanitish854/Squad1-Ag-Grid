import { useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";

import {
  ModuleRegistry,
  AllCommunityModule
} from "ag-grid-community";

import type {
  GridApi,
  ColDef
} from "ag-grid-community";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

ModuleRegistry.registerModules([
  AllCommunityModule,
]);

interface GenericGridProps {
  data: any[];
  columns: ColDef[];
}

export default function GenericGrid({
  data,
  columns,
}: GenericGridProps) {
  const gridApiRef = useRef<GridApi | null>(
    null
  );

  const [searchText, setSearchText] =
    useState("");

  const [selectedColumns, setSelectedColumns] =
    useState(
      columns.map((x: any) => x.field)
    );

  const finalColumns = useMemo(() => {
    const visibleColumns =
      columns.filter((col: any) =>
        selectedColumns.includes(col.field)
      );

    return [
      ...visibleColumns,

      {
        headerName: "Actions",
        field: "actions",

        cellRenderer: (params: any) => (
          <div
            style={{
              display: "flex",
              gap: "5px",
            }}
          >
            <button
              onClick={() =>
                alert(
                  `View ${params.data.userName}`
                )
              }
            >
              View
            </button>

            <button
              onClick={() =>
                alert(
                  `Edit ${params.data.userName}`
                )
              }
            >
              Edit
            </button>
          </div>
        ),
      },
    ];
  }, [columns, selectedColumns]);

  const onSearch = (
    value: string
  ) => {
    setSearchText(value);

    gridApiRef.current?.setGridOption(
      "quickFilterText",
      value
    );
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        padding: "20px",
      }}
    >
      <h2>
        Enterprise Generic Grid
      </h2>

      {/* Toolbar */}

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "15px",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="Search..."
          value={searchText}
          onChange={(e) =>
            onSearch(e.target.value)
          }
          style={{
            padding: "8px",
            width: "250px",
          }}
        />

        <button
          onClick={() =>
            gridApiRef.current?.exportDataAsCsv()
          }
        >
          Export CSV
        </button>
      </div>

      {/* Column Selector */}

      <div
        style={{
          marginBottom: "15px",
        }}
      >
        <strong>
          Select Columns:
        </strong>

        <br />

        {columns.map((col: any) => (
          <label
            key={col.field}
            style={{
              marginRight: "15px",
            }}
          >
            <input
              type="checkbox"
              checked={selectedColumns.includes(
                col.field
              )}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedColumns(
                    [
                      ...selectedColumns,
                      col.field,
                    ]
                  );
                } else {
                  setSelectedColumns(
                    selectedColumns.filter(
                      (x) =>
                        x !== col.field
                    )
                  );
                }
              }}
            />

            {col.headerName}
          </label>
        ))}
      </div>

      <div
        className="ag-theme-quartz"
        style={{
          width: "100%",
          height: "700px",
        }}
      >
        <AgGridReact
          rowData={data}
          columnDefs={finalColumns}
          pagination={true}
          paginationPageSize={10}
          rowSelection={{
            mode: "multiRow",
          }}
          animateRows={true}
          defaultColDef={{
            sortable: true,
            filter: true,
            resizable: true,
            floatingFilter: true,
          }}
          onGridReady={(params) => {
            gridApiRef.current =
              params.api;
          }}
        />
      </div>
    </div>
  );
}