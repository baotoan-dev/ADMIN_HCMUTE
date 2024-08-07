import { forwardRef } from "react";
import {
    DataGrid,
    GridToolbarQuickFilter,
    GridToolbarExport,
} from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import pdfMake from "pdfmake/build/pdfmake";
import * as XLSX from 'xlsx';
import { Select } from 'antd';

const { Option } = Select;
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
const CssGridToolbarExport = ({ rows, columns }) => {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                "& > div": {
                    fontFamily: "inherit",
                    fontSize: "1rem",
                    color: "inherit",
                    "&:hover::before": {
                        borderBottom: "1px solid #fff",
                    },
                },
            }}
        >
            <OptionsExport rows={rows} columns={columns} />
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

const OptionsExport = ({ rows, columns }) => {
    const headers = columns?.map((col) => ({ label: col.headerName, key: col.field }));
    const data = rows.map((row) => {
        const rowData = {};
        columns.forEach((col) => {
            rowData[col.field] = row[col.field];
        });
        return rowData;
    });


    const handleExport = (value) => {
        if (value === 'pdf') {
            exportPDF();
        } else if (value === 'csv') {
            exportCSV();
        } else if (value === 'excel') {
            exportExcel();
        }
    };


    const exportPDF = () => {
        const customWidths = [20, 110, 150, 80, 20, 100];

        const docDefinition = {
            content: [
                {
                    table: {
                        headerRows: 1,
                        widths: customWidths,
                        body: [
                            headers.map(header => ({ text: header.label, fillColor: '#81A263', color: 'white', textAlign: 'center' })),
                            ...data.map((row, rowIndex) => headers.map(header => ({
                                text: row[header.key] || "",
                                fillColor: rowIndex % 2 === 0 ? '#F1F8E8' : 'white',
                            }))),
                        ],
                    },
                },
            ],
        };
        pdfMake.createPdf(docDefinition).download("userHistories.pdf");
    };

    const exportExcel = () => {
        let countSheet = 1;
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet' + countSheet);
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = 'userHistories.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const exportCSV = () => {
        const csvData = [headers.map(header => header.label), ...data.map(row => headers.map(header => row[header.key]))];
        const csvContent = "data:text/csv;charset=utf-8," + csvData.map(e => e.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "userHistories.csv");
        document.body.appendChild(link);
        link.click();
    };

    return (
        <Box>
            <Select
                defaultValue="Export"
                style={{
                    width: 120,
                    backgroundColor: "#66bb6a",
                    border: "none",
                    borderRadius: "4px",
                }}
                bordered={false}
                onSelect={handleExport}
            >
                <Option value="pdf">PDF</Option>
                <Option value="csv">CSV</Option>
                <Option value="excel">Excel</Option>
            </Select>
        </Box>
    );
};

function CustomToolbar({ rows, columns }) {
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
            <CssGridToolbarExport rows={rows} columns={columns} />
            <CssGridToolbarQuickFilter />
        </Box>
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


const TableUserHistories = forwardRef((props, ref) => {
    const {
        rows,
        columns,
        showCheckbox = true,
        selectionModel,
        onSelectionModelChange,
        handleCheck
    } = props;

    return (
        <CssDataGrid
            sx={{ padding: "0.5rem" }}
            ref={ref}
            rows={rows}
            columns={columns}
            autoPageSize
            checkboxSelection={showCheckbox}
            rowHeight={46}
            disableSelectionOnClick={true}
            components={{
                // Toolbar: GridToolbar,
                Toolbar: () => <CustomToolbar rows={rows} columns={columns} />,
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

export default TableUserHistories;