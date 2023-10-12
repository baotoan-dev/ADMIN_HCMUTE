import React from "react";
import moment from "moment";
import { Chip } from "@mui/material";
import { Link } from "react-router-dom";

const workerDetailColumns = [
  {
    field: "id",
    headerName: "ID",
    flex: 0.5,
    minWidth: 100,
    filterable: true,
    renderCell: (params) => (
      <Link
        target="_blank"
        to={`/admin/posts/${params.row.id}`}
        style={{
          padding: "0.5rem 4rem 0.5rem 0",
          textDecoration: "underline",
        }}
      >
        {params.row.id}
      </Link>
    ),
  },
  {
    field: "company_name",
    headerName: "Công ty",
    type: "string",
    flex: 1,
    minWidth: 150,
    filterable: true,
  },
  {
    field: "title",
    headerName: "Tên",
    type: "string",
    flex: 1,
    minWidth: 150,
    filterable: true,
  },
  {
    field: "status",
    headerName: "Trạng thái",
    type: "string",
    flex: 0.5,
    minWidth: 100,
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
    field: "start_time",
    headerName: "START TIME",
    flex: 0.75,
    type: "string",
    minWidth: 100,
    filterable: true,
    renderCell: (params) => 
      moment(+params.row.start_time).format("DD/MM/YYYY HH:mm:ss")
    },
  {
    field: "end_time",
    headerName: "END TIME",
    flex: 0.75,
    minWidth: 100,
    type: "string",
    filterable: true,
    renderCell: (params) =>
      moment(+params.row.end_time).format("DD/MM/YYYY HH:mm:ss")
  },
  {
    field: "url",
    headerName: "URL",
    flex: 1.75,
    minWidth: 200,
    filterable: true,
  },
];

export default workerDetailColumns;
