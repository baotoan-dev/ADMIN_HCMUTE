import moment from "moment";
import { Chip } from "@mui/material";
// import { Link } from "react-router-dom";

const applicationsOfPostColumns = [
  {
    field: "id",
    headerName: "ID",
    flex: 0.5,
    minWidth: 100,
    filterable: true,
  },
  {
    field: "name",
    headerName: "Name",
    type: "string",
    flex: 1,
    minWidth: 150,
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
      switch (params.row.application_status) {
        case 0:
          return <Chip variant="outlined" color="primary" label="Pending" />;
        case 1:
          return <Chip variant="outlined" color="info" label="Seen" />;
        case 2:
          return <Chip variant="outlined" color="secondary" label="Approved" />;
        case 3:
          return <Chip variant="outlined" color="error" label="Rejected" />;
        case 4:
          return <Chip variant="outlined" color="success" label="Accepted" />;
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

export default applicationsOfPostColumns;
