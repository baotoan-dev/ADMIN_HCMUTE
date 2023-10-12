import React, { forwardRef } from "react";
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
import "./style.scss";
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import SearchCircle from '@mui/icons-material/Search';
import MenuItem from '@mui/material/MenuItem';
import ClearCircle from "@mui/icons-material/Clear";
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';
import { debounce } from "lodash";
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

function CustomToolbar({ handleSearchFilterParent, checkAutoFocus }) {

  const [valueSearch, setValueSearch] = React.useState('');
  const [prevValueSearch, setPrevValueSearch] = React.useState('');

  React.useEffect(() => {
    const savedValue = localStorage.getItem('searchValue');
    if (savedValue) {
      setValueSearch(savedValue);
      setPrevValueSearch(savedValue);
    }
  }, []);

  const delayedHandleSearch = React.useCallback(
    debounce((searchValue) => {
      handleSearchFilterParent(searchValue);
    }),
    []
  );

  const handleChange = (event) => {
    const searchValue = event.target.value;
    setValueSearch(searchValue);
    localStorage.setItem('searchValue', searchValue);
  };

  const handleClearSearch = () => {
    setValueSearch('');
    localStorage.removeItem('searchValue');
  };

  React.useEffect(() => {
    if (valueSearch !== prevValueSearch) {
      const timeoutId = setTimeout(() => {
        delayedHandleSearch(valueSearch);
      }, 1000);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [valueSearch, prevValueSearch, delayedHandleSearch]);

  React.useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem('searchValue');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Remove localStorage when modify page 

  React.useEffect(() => {
    localStorage.removeItem('searchValue');
  }, [window.location.href])

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
      {/* <CssGridToolbarQuickFilter /> */}
      <Input autoFocus = {checkAutoFocus ? true : false} value={valueSearch} style={{width: "45%", height: "1.75rem", border: "none", outline: "none", backgroundColor: "none", padding: '1rem 0rem'}} placeholder="Search...." onChange={(e) => handleChange(e)}
          id="input-with-icon-adornment"
          startAdornment={
          <InputAdornment position="start">
            <SearchCircle style={{width: '1.25rem'}}/>
          </InputAdornment>
          }
          endAdornment={
            <InputAdornment position="end" onClick = {handleClearSearch}>
              <ClearCircle style={{cursor: 'pointer', width: '1.25rem'}} />
            </InputAdornment>
          }
      />    
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
  height: "90%",
}));

const Table = forwardRef((props, ref) => {
  const {
    rows,
    currentPage,
    nextPage,
    prevPage,
    columns,
    checkData,
    showCheckbox = true,
    selectionModel,
    onSelectionModelChange,
    handleSearchFilterParent,
    handleOnchangeLimit,
    checkAutoFocus,
    checkSearch
  } = props;

   const [limit, setLimit] = React.useState(10);

  const handleChangeLimit = (event) => {
    setLimit(event.target.value);
    handleOnchangeLimit(event.target.value);
  };

  const handleNextPage = () => {
    nextPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    prevPage(currentPage - 1);
  };

  return (
    <>
      <CssDataGrid
        sx={{ padding: "0.5rem" }}
        ref={ref}
        rows={rows}
        columns={columns}
        // autoPageSize
        // pageSize={10}
        checkboxSelection={showCheckbox}
        rowHeight={46}
        disableSelectionOnClick={true}
        disableColumnMenu={true}
        components={{
          // Toolbar: GridToolbar,
          // Toolbar: CustomToolbar,
          Toolbar: () => <CustomToolbar checkAutoFocus={checkAutoFocus} handleSearchFilterParent={handleSearchFilterParent} />,
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
        hideFooter={checkSearch ? false : true}
      />
       <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          marginTop: "1rem",
          gap: "1rem",
        }}
      >
      {(checkData && !checkSearch) && (
      <FormControl sx={{ m: 1, minWidth: 80 }} size="small">
        <InputLabel id="demo-simple-select-autowidth-label">Limit</InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={limit}
          onChange={handleChangeLimit}
          autoWidth
          label="Limit"
        >
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={20}>20</MenuItem>
          <MenuItem value={50}>50</MenuItem>
        </Select>
      </FormControl>
      )}
      
      {(checkData && !checkSearch) && (
        <>
          <div style={{color: 'white'}}>
            Page {currentPage}
          </div>
          <div>
            <Button
              style={{ marginRight: "0.5rem", borderRadius: '10%' }}
              variant="outlined"
              onClick={() => handlePrevPage()}
              disabled={currentPage === 1}
            >
              {"<"}
            </Button>
            <Button
              variant="outlined"
              style={{borderRadius: '10%'}}
              onClick={() => handleNextPage()}
              disabled={checkData === false || rows.length === 0}
            >
              {">"}
            </Button>
          </div>
        </>
      )}

     </div>
    
    </>
  );
  
});

export default Table;
export { CustomNoRowsOverlay, CustomToolbar, CustomPagination };
