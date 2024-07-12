import React from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import { Avatar } from "antd";
import { Chip } from "@mui/material";

const themeColumns = [
  {
    field: "id",
    headerName: "ID",
    flex: 1,
    minWidth: 20,
    filterable: true,
    renderCell: (params) => (
      <Link
        to={`/admin/hot-manager/${params.row.id}`}
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
    field: "logo",
    headerName: "Logo",
    flex: 0.5,
    minWidth: 60,
    filterable: true,
    renderCell: (params) => {
      return (
        <Avatar
          alt={params.row.name}
          src={params.row.logo}
          sx={{ width: 50, height: 50 }}
          variant="rounded"
        />
      );
    },
  },
  {
    field: "image",
    headerName: "Image",
    flex: 0.5,
    minWidth: 60,
    filterable: true,
    renderCell: (params) => {
      return (
        <Avatar
          alt={params.row.name}
          src={params.row.image}
          sx={{ width: 50, height: 50 }}
          variant="rounded"
        />
      );
    },
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
    flex: 0.5,
    minWidth: 110,
    filterable: true,
    renderCell: (params) => {
      switch (params.row.status) {
        case 0:
          return <Chip label="Ẩn" color="error" />;
        case 1:
          return <Chip label="Hiển thị" color="success" />;
        default:
          return <Chip label="Ẩn" color="error" />;
      }
    },
  },
  {
    field: "created_at",
    headerName: "Ngày tạo",
    type: "string",
    flex: 1,
    minWidth: 150,
    renderCell: (params) =>
      moment(params.row.created_at).format("DD/MM/YYYY HH:mm:ss"),
  },
];

export default themeColumns;
