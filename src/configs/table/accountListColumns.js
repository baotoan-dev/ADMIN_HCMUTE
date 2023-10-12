import { Box } from "@mui/material";
import { Link } from "react-router-dom";
import moment from "moment/moment";

const AccountListColumns = [
  {
    field: "id",
    headerName: "ID",
    flex: 1,
    minWidth: 150,
    renderCell: (params) => (
      <Link
        to={`/admin/accounts/${params.row.id}?role=${params.row.role}`}
        style={{ textDecoration: "underline" }}
      >
        {params.row.id}
      </Link>
    ),
    filterable: true,
  },
  {
    field: "email",
    headerName: "Email",
    type: "string",
    flex: 1,
    minWidth: 150,
    renderCell: (params) => (
      <Box className="MuiDataGrid-cellContent ellipsis">
        {params.row.email ? params.row.email : "NULL"}
      </Box>
    ),
    filterable: true,
  },
  {
    field: "phone",
    headerName: "Phone",
    type: "string",
    flex: 1,
    minWidth: 150,
    renderCell: (params) => (
      <Box className="MuiDataGrid-cellContent ellipsis">
        {params.row.phone ? params.row.phone : "NULL"}
      </Box>
    ),
    filterable: true,
  },
  {
    field: "created_at",
    headerName: "Created at",
    type: "string",
    flex: 1,
    minWidth: 150,
    renderCell: (params) =>
      moment(params.row.created_at).format("DD/MM/YYYY HH:mm:ss"),
  },
];

export default AccountListColumns;
