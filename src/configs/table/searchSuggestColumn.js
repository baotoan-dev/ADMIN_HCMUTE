import React from "react";
import moment from "moment";
import { Chip } from "@mui/material";
import { Link } from "react-router-dom";

const searchSuggestColumn = [
  {
    field: "id",
    headerName: "ID",
    flex: 0.5,
    minWidth: 100,
    filterable: true,
    renderCell: (params) => (
      <Link
        to={`/admin/search-suggest/${params.row.id}`}
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
    field: "keyword",
    headerName: "KEYWORD",
    type: "string",
    editable: true,
    flex: 1,
    minWidth: 200,
    filterable: true,
  },
  {
    field: "order",
    headerName:"ORDER",
    type: "number",
    align: 'left',
    editable: true,
    flex: 1,
    minWidth: 200,
    headerAlign: 'left',
    filterable: true,
  },
  {
    field: "createdAt",
    headerName: "CREATED_AT",
    type: "string",
    flex: 1,
    minWidth: 200,
    renderCell: (params) =>
      moment(params.row.createdAt).format("DD/MM/YYYY HH:mm:ss"),
  },
  {
    field: "updatedAt",
    headerName: "UPDATED_AT",
    type: "string",
    flex: 1,
    minWidth: 200,
    renderCell: (params) =>
      moment(params.row.updatedAt).format("DD/MM/YYYY HH:mm:ss"),
  },
  {
    field: "status",
    headerName: "STATUS",
    type: "int",
    flex: 0.5,
    minWidth: 100,
    filterable: true,
    renderCell: (params) => {
      switch (params.row.status) {
        case 0:
          return <Chip variant="outlined" color="primary" label="Disable" style={{
            backgroundColor: "#f44336",
            border: "none",
            color: "white",
            boxShadow: "0 0 0 1px black",
          }}/>;
        case 1:
          return <Chip variant="outlined" color="success" label="Enable" style={{
            backgroundColor: "#4caf50",
            border: "none",
            color: "white",
            boxShadow: "0 0 0 1px black",
          }}/>;
        default:
      }
    },
  },
];

export default searchSuggestColumn;
