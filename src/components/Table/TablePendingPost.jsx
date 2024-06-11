import { forwardRef } from "react";
import {
    DataGrid,
    GridToolbarQuickFilter,
    GridToolbarExport,
    gridPageCountSelector,
    gridPageSelector,
    useGridApiContext,
    useGridSelector,
} from "@mui/x-data-grid";
import { Pagination, Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

// Custom display when empty row
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

// Custom toolbar
const CssGridToolbarExport = styled(GridToolbarExport)(({ theme }) => ({
    color: theme.palette.color.primary,
    fontSize: "1rem",
    "& .MuiMenuItem-root": {
        fontSize: "1rem",
    },
}));

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
            <CssGridToolbarExport />
            <CssGridToolbarQuickFilter />
        </Box>
    );
}

// Custom pagination
function CustomPagination() {
    const apiRef = useGridApiContext();
    const page = useGridSelector(apiRef, gridPageSelector);
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);

    return (
        <Pagination
            color="primary"
            count={pageCount}
            page={page + 1}
            onChange={(event, value) => apiRef.current.setPage(value - 1)}
        />
    );
}

// CSS GRID
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


const TablePendingPost = forwardRef((props, ref) => {
    const {
        rows,
        columns,
        showCheckbox = true,
        selectionModel,
        onSelectionModelChange,
        handleRefreshDelete
    } = props;

    return (
        <CssDataGrid
            sx={{ padding: "0.5rem"}}
            ref={ref}
            rows={rows}
            columns={columns}
            autoPageSize
            checkboxSelection={showCheckbox}
            rowHeight={46}
            disableSelectionOnClick={true}
            // disableColumnMenu={true}
            components={{
                // Toolbar: GridToolbar,
                Toolbar: CustomToolbar,
                NoRowsOverlay: CustomNoRowsOverlay,
                // Pagination: CustomPagination,
            }}
            componentsProps={{
                toolbar: {
                    showQuickFilter: true,
                    quickFilterProps: { debounceMs: 1000 },
                },
            }}
            selectionModel={selectionModel}
            onSelectionModelChange={onSelectionModelChange}
        />
    );
});

export default TablePendingPost;