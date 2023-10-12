import React from "react";
import moment from "moment";
import { Link } from "react-router-dom";

const workerColumns = [
  {
    field: "id",
    headerName: "ID",
    flex: 1,
    minWidth: 100,
    filterable: true,
    renderCell: (params) => (
      <Link
        to={`/admin/worker-manager/detail?aid=${params.row.id}`}
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
    field: "email",
    headerName: "Email",
    type: "string",
    flex: 1,
    minWidth: 150,
    filterable: true,
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

export default workerColumns;
