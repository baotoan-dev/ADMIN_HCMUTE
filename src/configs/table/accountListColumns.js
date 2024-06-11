import { Box } from "@mui/material";
import { Link } from "react-router-dom";
import moment from "moment/moment";
import { Chip } from "@mui/material";

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
    field: "status",
    headerName: "Status",
    type: "string",
    flex: 0.5,
    minWidth: 100,
    filterable: true,
    renderCell: (params) => {
      switch (params.row.status) {
        case 0:
          return <Chip variant="outlined" color="primary" label="Block" style={{
            backgroundColor: "#f44336",
            border: "none",
            color: 'white'
          }} />;
        case 1:
          return <Chip variant="outlined" color="success" label="Active" style={{
            backgroundColor: "#4caf50",
            border: "none",
            color: 'white'
          }} />;
        default:
      }
    },
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
