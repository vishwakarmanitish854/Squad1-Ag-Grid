import GenericGrid from "../components/GenericGrid";

import { users } from "../data/users";

export default function Users() {
  const columns = [
    {
      field: "userId",
      headerName: "User ID",
      width: 120,
    },

    {
      field: "userName",
      headerName: "User Name",
      flex: 1,
    },

    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },

    {
      field: "department",
      headerName: "Department",
      width: 180,
    },
  ];

  const summaryCards = [
    {
      title: "Total Users",
      value: users.length,
    },

    {
      title: "IT Users",

      value: users.filter(
        (x) => x.department === "IT"
      ).length,
    },

    {
      title: "Security Users",

      value: users.filter(
        (x) =>
          x.department === "Security"
      ).length,
    },
  ];

  const actions = [
    {
      label: "View",

      className: "view-btn",

      onClick: (row: any) => {
        alert(
          `View User : ${row.userName}`
        );
      },
    },

    {
      label: "Edit",

      className: "edit-btn",

      onClick: (row: any) => {
        alert(
          `Edit User : ${row.userName}`
        );
      },
    },
  ];

  return (
    <GenericGrid
      title="Users Management"
      searchPlaceholder="Search Users..."
      data={users}
      columns={columns}
      summaryCards={summaryCards}
      actions={actions}
    />
  );
}