import { Link } from "react-router-dom";
import { Chip } from "@mui/material";

export const postsCompanyListColumn = [
  {
    field: "id",
    headerName: "Id",
    flex: 0.5,
    minWidth: 80,
    filterable: true,
    renderCell: (params) => (
      <Link
        // target="_blank"
        to={`/admin/posts/${params.row.id}`}
        style={{
          width: "100%",
          textDecoration: "underline",
        }}
      >
        {params.row.id}
      </Link>
    ),
  },
  {
    field: "companyName",
    headerName: "Company name",
    flex: 1,
    minWidth: 350,
    filterable: true,
  },
  {
    field: "title",
    headerName: "Title",
    flex: 1,
    minWidth: 350,
    filterable: true,
  },
  {
    field: "status",
    headerName: "Status",
    flex: 0.5,
    minWidth: 110,
    filterable: true,
    renderCell: (params) => {
      switch (params.row.status) {
        case 0:
          return <Chip variant="outlined" color="primary" label="Pending" />;
        case 1:
          return <Chip variant="outlined" color="success" label="Accepted" />;
        case 2:
          return <Chip variant="outlined" color="error" label="Rejected" />;
        case 3:
          return <Chip variant="outlined" color="secondary" label="Closed" />;
        default:
      }
    },
  },
  {
    field: "Location",
    headerName: "Location",
    flex: 1,
    minWidth: 100,
    filterable: true,
    renderCell: (params) => {
      if (!params.row.companyLocation) {
        return "Location not updated yet";
      }
      return params.row.location.district.province.fullName;
    },
  },
];

export default postsCompanyListColumn;
