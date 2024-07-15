import React from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import { Chip } from "@mui/material";

const userPointHistoriesColumns = [
  {
    field: "id",
    headerName: "ID",
    minWidth: 5,
    filterable: true,
    renderCell: (params) => <Link>{params.row.id}</Link>,
  },
  {
    field: "userId",
    headerName: "ID user",
    type: "string",
    flex: 1,
    minWidth: 300,
    filterable: true,
  },
  {
    field: "orderId",
    headerName: "ID order",
    type: "string",
    flex: 1,
    minWidth: 200,
  },
  {
    field: "amount",
    headerName: "Money",
    type: "string",
    flex: 1,
    minWidth: 100,
  },
  {
    field: "status",
    headerName: "Status",
    flex: 0.5,
    minWidth: 150,
    filterable: true,
    renderCell: (params) => {
      switch (params.row.status) {
        case 0:
          return <Chip label="Unfinished" color="error" />;
        case 1:
          return <Chip label="Finished" color="success" />;
        default:
          return <Chip label="Unfinished" color="error" />;
      }
    },
  },
  {
    field: "createdAt",
    headerName: "Ngày tạo",
    type: "date",
    flex: 1,
    minWidth: 150,
    renderCell: (params) => (
      <span>{moment(params.row.createdAt).format("DD/MM/YYYY")}</span>
    ),
  },
];

export default userPointHistoriesColumns;
