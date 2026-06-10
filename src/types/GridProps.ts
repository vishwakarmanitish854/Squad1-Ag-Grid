import type { ColDef } from "ag-grid-community";

export interface GridAction {
  label: string;
  className?: string;
  onClick: (row: any) => void;
}

export interface SummaryCard {
  title: string;
  value: number | string;
}

export interface GenericGridProps {
  title: string;

  searchPlaceholder?: string;

  data: any[];

  columns: ColDef[];

  summaryCards?: SummaryCard[];

  actions?: GridAction[];
}