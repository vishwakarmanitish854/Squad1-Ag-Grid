import { useMemo } from 'react';
import type { ColDef } from 'ag-grid-community';
import GenericGrid from '../components/GenericGrid';
import userService from '../services/userService';
import type { UserRow } from '../types/index';
import type { PaginationParams, SortParams } from '../types/GridProps';

export default function Users() {
  const columns = useMemo<ColDef<UserRow>[]>(
    () => [
      {
        field: 'UserID',
        headerName: 'ID',
        width: 80,
      },
      {
        field: 'Employee_Code',
        headerName: 'Employee Code',
        flex: 1,
      },
      {
        field: 'Employee_Name',
        headerName: 'Employee Name',
        flex: 1,
      },
      {
        field: 'LoginID',
        headerName: 'Login ID',
        flex: 1,
      },
      {
        field: 'Employee_Mobile',
        headerName: 'Mobile',
        width: 120,
      },
      {
        field: 'Department',
        headerName: 'Department',
        width: 120,
      },
      {
        field: 'Status',
        headerName: 'Status',
        width: 110,
        cellRenderer: (props: any) => (
          <span style={{
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: '500',
            backgroundColor: props.value === 'active' ? '#dcfce7' : props.value === 'inactive' ? '#f3f4f6' : '#fef08a',
            color: props.value === 'active' ? '#166534' : props.value === 'inactive' ? '#6b7280' : '#854d0e',
          }}>
            {props.value || '-'}
          </span>
        ),
      },
    ],
    []
  );

  const summaryCards = useMemo(
    () => [
      {
        title: 'Total Employees',
        value: 1000,
      },
      {
        title: 'Active Users',
        value: 650,
      },
      {
        title: 'Departments',
        value: 4,
      },
    ],
    []
  );

  const actions = useMemo(
    () => [
      {
        label: 'View',
        onClick: (row: UserRow) => {
          alert(`View User: ${row.Employee_Name} (${row.LoginID})`);
        },
      },
      {
        label: 'Edit',
        onClick: (row: UserRow) => {
          alert(`Edit User: ${row.Employee_Name}`);
        },
      },
      {
        label: 'Delete',
        onClick: (row: UserRow) => {
          alert(`Delete User: ${row.Employee_Name}`);
        },
      },
    ],
    []
  );

  // Server-side data source
  const serverDataSource = async (pagination: PaginationParams, sort: SortParams, filters: Record<string, any>) => {
    return await userService.getUsers(
      { searchText: filters.search, ...filters },
      sort,
      pagination
    );
  };

  return (
    <GenericGrid<UserRow>
      title="Users Management"
      searchPlaceholder="Search by name, code, or ID..."
      columns={columns}
      summaryCards={summaryCards}
      actions={actions}
      serverDataSource={serverDataSource}
      onRowSelected={(rows) => {
        console.log('Selected rows:', rows);
      }}
      onSortChanged={(sort) => {
        console.log('Sort changed:', sort);
      }}
      pageSize={10}
      enableColumnSelection
      enableRowSelection
      enableExport
    />
  );
}
