import { forwardRef } from "react";
import {
    DataGrid,
    GridToolbar,
    GridToolbarContainer,
    GridToolbarFilterButton,
    GridToolbarQuickFilter,
    GridToolbarExport,
    gridPageCountSelector,
    gridPageSelector,
    useGridApiContext,
    useGridSelector,
} from "@mui/x-data-grid";
import { Pagination, Box, Typography } from "@mui/material";
import { useTheme, styled } from "@mui/material/styles";
import { axios } from "configs";
import { toast } from "react-toastify";

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


const TableCategoryParent = forwardRef((props, ref) => {
    const {
        rows,
        columns,
        showCheckbox = true,
        selectionModel,
        onSelectionModelChange,
        handleRefreshDelete,
        handleCheck
    } = props;

    const handleModifyStatus = async (params) => {
        let res; 
        if (params.field === 'status') {
            if (params.row.status === 1) {
                res = await axios.put(`/v3/parent/${params.row.id}`, 
                {
                    status: 0,
                });
              }
              else {
                res = await axios.put(`/v3/parent/${params.row.id}`, 
                {
                    status: 1,
                });
              }
              if (res.status === 200) {
                handleCheck()
                toast.success("Điều chỉnh trạng thái danh mục thành công")
              }
              else
              {
                toast.error("Điều chỉnh trạng thái danh mục thất bại")
              }
        } 
    };

    const handleCellClick = async (params) => {
        if (params.field === 'name' || params.field === 'nameEn' || params.field === 'nameKor') {
            document.addEventListener('keydown', handleKeyDown);
            async function handleKeyDown(e) {
            if (e.keyCode === 13) {
                const { id, value, field } = params;
                try {
                    const res = await axios.put(`/v3/parent/${id}`, {
                      [field]: value,
                    });
                if (res && res.status === 200) {
                    handleCheck()
                    toast.success('Updated successfully')
                }
                else {
                    toast.error('Update failed')
                }
                } catch (error) {
                    console.error(error);
                }
                document.removeEventListener('keydown', handleKeyDown);
                }
            }
        }
    }

    return (
        <CssDataGrid
            sx={{ padding: "0.5rem"}}
            ref={ref}
            rows={rows}
            columns={columns}
            autoPageSize
            checkboxSelection={showCheckbox}
            rowHeight={46}
            onCellClick={handleModifyStatus}
            disableSelectionOnClick={true}
            onCellEditCommit={handleCellClick}
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

export default TableCategoryParent;