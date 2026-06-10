import GenericGrid from "../components/GenericGrid";
import { users } from "../data/users";

export default function Users() {
  const columns = [
    {
      field: "userId",
      headerName: "User Id",
    },
    {
      field: "userName",
      headerName: "User Name",
    },
    {
      field: "email",
      headerName: "Email",
    },
    {
      field: "department",
      headerName: "Department",
    },
  ];

  return (
    <GenericGrid
      columns={columns}
      data={users}
    />
  );
}