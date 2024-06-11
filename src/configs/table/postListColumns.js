import React from "react";
import moment from "moment";
import { Chip } from "@mui/material";
import { Link } from "react-router-dom";

const PostListColumns = [
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
          return <Chip variant="outlined" color="primary" label="Pending" style={{
            backgroundColor: 'warring',
            border: 'none',
            color: 'white'
          }} />;
        case 1:
          return <Chip variant="outlined" color="success" label="Accepted" style={{
            backgroundColor: 'green',
            border: 'none',
            color: 'white'
          }} />;
        case 2:
          return <Chip variant="outlined" color="error" label="Rejected" style={{
            backgroundColor: 'red',
            border: 'none',
            color: 'white'
          }} />;
        case 3:
          return <Chip variant="outlined" color="secondary" label="Closed" style={{
            backgroundColor: 'grey',
            border: 'none',
            color: 'white'
          }} />;
        default:
      }
    },
  },
  // {
  //   field: "province",
  //   headerName: "Thành phố",
  //   type: "string",
  //   flex: 1,
  //   minWidth: 150,
  //   // renderCell: (params) =>
  //   //   moment(params.row.created_at).format("DD/MM/YYYY HH:mm:ss"),
  // },
  {
    field: "district",
    headerName: "Quận/Huyện",
    flex: 0.75,
    minWidth: 100,
    // renderCell: (params) =>
    //   moment(params.row.created_at).format("DD/MM/YYYY HH:mm:ss"),
  },
  {
    field: "ward",
    headerName: "Phường/Xã",
    flex: 1,
    minWidth: 100,
    // renderCell: (params) =>
    //   moment(params.row.created_at).format("DD/MM/YYYY HH:mm:ss"),
  },
  {
    field: "address",
    headerName: "Địa chỉ",
    flex: 1.75,
    minWidth: 200,
    // renderCell: (params) =>
    //   moment(params.row.created_at).format("DD/MM/YYYY HH:mm:ss"),
  },
  // {
  //   field: "created_at",
  //   headerName: "Ngày tạo",
  //   type: "string",
  //   flex: 1,
  //   minWidth: 150,
  //   renderCell: (params) =>
  //     moment(params.row.created_at).format("DD/MM/YYYY HH:mm"),
  // },
];

export default PostListColumns;
