import React from "react";
import moment from "moment";
import { Chip } from "@mui/material";
import { Link } from "react-router-dom";

const categoryColumns = [
  {
    field: "id",
    headerName: "ID",
    flex: 0.5,
    minWidth: 100,
    filterable: true,
    renderCell: (params) => (
      <Link
        to={`/admin/category-manager/${params.row.id}`}
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
    field: "name",
    headerName: "Name",
    type: "string",
    editable: true,
    flex: 1,
    minWidth: 150,
    filterable: true,
  },
  {
    field: "nameEn",
    headerName: "NAME_EN",
    type: "string",
    flex: 1,
    editable: true,
    minWidth: 150,
    filterable: true,
  },
  {
    field: "nameKor",
    headerName: "NAME_KOR",
    type: "string",
    flex: 1,
    editable: true,
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
          return <Chip variant="outlined" color="primary" label="Disable" style={{
            backgroundColor: "#f44336",
            border: "none",
            color: 'white'
          }}/>;
        case 1:
          return <Chip variant="outlined" color="success" label="Enable" style={{
            backgroundColor: "#4caf50",
            border: "none",
            color: 'white'
          }}/>;
        default:
      }
    },
  },
];

export default categoryColumns;
