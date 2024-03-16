import React, { forwardRef } from "react";
import { DataGrid, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";

import { Box, Typography } from "@mui/material";

function CustomNoRowsOverlay() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <Typography>No Rows</Typography>
    </Box>
  );
}

const CssGridToolbarQuickFilter = styled(GridToolbarQuickFilter)(
  ({ theme }) => ({
    flex: 1,
    "& > div": {
      fontFamily: theme.fontFamily,
      fontSize: "1rem",
      color: theme.palette.color.main,
      alignSelf: "flex-end",
      [theme.breakpoints.up("sm")]: {
        width: "100%",
      },
      [theme.breakpoints.up("md")]: {
        width: "50%",
      },
      "&:hover::before": {
        borderBottom: theme.palette.border,
      },
    },
  })
);

function CustomToolbar() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: {
          xs: "column",
          md: "row",
        },
        justifyContent: "space-between",
        alignItems: {
          xs: "flex-start",
          md: "center",
        },
        padding: "0.625rem",
      }}
    >
      <CssGridToolbarQuickFilter />
    </Box>
  );
}

// Css grid
const CssDataGrid = styled(DataGrid)(({ theme }) => ({
  backgroundColor: theme.palette.background.content,
  fontFamily: theme.fontFamily,
  fontSize: "1rem",
  border: "none",
  "& .MuiDataGrid-cellContent, & .MuiDataGrid-columnHeaderTitle, & .MuiTablePagination-root":
    {
      color: theme.palette.color.main,
    },
  "& .Mui-disabled": {
    color: "rgba(255, 255, 255, 0.26)",
  },
}));

const TablePostsCompany = forwardRef((props, ref) => {
  const { columns, rows } = props;

  return (
    <CssDataGrid
      sx={{ padding: "0.5rem", height: "100%" }}
      ref={ref}
      rows={rows}
      columns={columns}
      autoPageSize
      rowHeight={65}
      components={{
        Toolbar: CustomToolbar,
        NoRowsOverlay: CustomNoRowsOverlay,
      }}
      componentsProps={{
        toolbar: {
          showQuickFilter: true,
          quickFilterProps: { debounceMs: 1000 },
        },
      }}
    />
  );
});

export default TablePostsCompany;
