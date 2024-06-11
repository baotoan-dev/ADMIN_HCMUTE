import React from "react";
import { Chip, Button } from "@mui/material";


const categoryChildColumns = [ 
  {
    field: "id",
    headerName: "ID",
    flex: 0.5,
    minWidth: 100,
    filterable: true
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
          return <Chip variant="outlined" color="primary" label="Disable" />;
        case 1:
          return <Chip variant="outlined" color="success" label="Enable" />;
        default:
      }
    },
  },

  {
    field: 'actions',
    headerName: "Actions",
    type: "button",
    flex: 0.5,
    minWidth: 100,
    sortable: false,
    filterable: false,
    renderCell: (params) => {
      return (
        <Button
          variant="outlined"
          color="primary"
          style={{borderRadius: "1rem", width: "2rem", height: '2rem'}}
        >
          {params.row.status === 0 ? "Show" : "Hide"}
        </Button>
      );
    },
  }
];

export default categoryChildColumns;
