import React from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import { Chip } from "@mui/material";

const serviceColumns = [
  {
    field: "id",
    headerName: "ID",
    flex: 1,
    minWidth: 100,
    filterable: true,
    renderCell: (params) => (
      <Link
        to={`/admin/service-manager/${params.row.id}`}
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
    flex: 1,
    minWidth: 150,
    filterable: true,
  },
  {
    field: "description",
    headerName: "Description",
    type: "string",
    flex: 1,
    minWidth: 150,
    filterable: true,
  },
  {
    field: "price",
    headerName: "Price",
    type: "string",
    flex: 1,
    minWidth: 150,
    filterable: true,
  },
  {
    field: "discount",
    headerName: "Discount",
    type: "string",
    flex: 1,
    minWidth: 150,
    filterable: true,
  },
  {
    field: "expiration",
    headerName: "Expiration",
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
          return <Chip variant="outlined" color="primary" label="Disable" style={{
            backgroundColor: "red",
            color: "white",
            border: 'none',
            boxShadow: "0 0 0 0",
          }} />;
        case 1:
          return <Chip variant="outlined" color="success" label="Enable" style={{
            backgroundColor: "green",
            color: "white",
            border: 'none',
            boxShadow: "0 0 0 0",
          }} />;
        default:
      }
    },
  },
  {
    field: "created_at",
    headerName: "Ngày tham gia",
    type: "string",
    flex: 1,
    minWidth: 150,
    renderCell: (params) =>
      moment(params.row.created_at).format("DD/MM/YYYY HH:mm:ss"),
  },
];

export default serviceColumns;
