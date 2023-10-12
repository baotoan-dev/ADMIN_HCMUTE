import React from "react";
import moment from "moment";
import { Chip } from "@mui/material";
import { Link } from "react-router-dom";

const communityListColumns = [
  {
    field: "id",
    headerName: "ID",
    flex: 0.5,
    minWidth: 100,
    filterable: true,
    renderCell: (params) => (
      <Link
        target="_blank"
        to={`/admin/community-detail/${params.row.id}`}
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
    field: "content",
    headerName: "Nội dung",
    type: "string",
    flex: 1,
    minWidth: 150,
    filterable: true,
  },
  {
    field: "title",
    headerName: "Tiêu đề",
    type: "string",
    flex: 1,
    minWidth: 150,
    filterable: true,
  },
  // {
  //   field: "status",
  //   headerName: "Trạng thái",
  //   type: "string",
  //   flex: 0.5,
  //   minWidth: 100,
  //   filterable: true,
  //   renderCell: (params) => {
  //     switch (params.row.status) {
  //       case 0:
  //         return <Chip variant="outlined" color="primary" label="Pending" />;
  //       case 1:
  //         return <Chip variant="outlined" color="success" label="Accepted" />;
  //       case 2:
  //         return <Chip variant="outlined" color="error" label="Rejected" />;
  //       case 3:
  //         return <Chip variant="outlined" color="secondary" label="Closed" />;
  //       default:
  //     }
  //   },
  // },
  {
    field: "created_at",
    headerName: "Ngày tạo",
    type: "string",
    flex: 1,
    minWidth: 150,
    renderCell: (params) =>
      moment(params.row.created_at).format("DD/MM/YYYY HH:mm"),
  },
];

export default communityListColumns;
