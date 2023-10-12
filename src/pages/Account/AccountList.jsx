import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Box, Typography, Stack, Skeleton } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { Table } from "components";
import { axios } from "configs";
import { accountListColumns } from "configs/table";
import { usePermission } from "hooks";

// PAGE
const AccountPage = () => {
  usePermission();

  const theme = useTheme();
  const [searchParams] = useSearchParams();
  const isToday = searchParams.get("is_today");
  const [accounts, setAccounts] = useState([]);
  // const [totalPages, setTotalPages] = useState(1);
  const [checkData, setCheckData] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [modifyLimit, setModifyLimit] = useState(10)
  const [dataSearch, setDataSearch] = useState('')
  const [checkSearch, setCheckSearch] = useState(false);

  // GET ALL ACCOUNTS
  useEffect(() => {
    const fetchAccountData = async () => {
      let res;

      let limitNumber = +modifyLimit ? +modifyLimit : 10

      if (isToday === "true") {
        // GET TODAY ACCOUNTS
        res = await axios.get(`/v1/accounts/today?page=${currentPage}&limit=${limitNumber}`);
      } else {
        // GET ALL ACCOUNTS
        res = await axios.get(`/v1/accounts?page=${currentPage}&limit=${limitNumber}`);
      }
      if (res && res.success) {
        if (res?.data?.length > 0) {
          setCheckData(true)
        }
        setAccounts(res.data);
        setIsLoading(false);
      }
      else{
        setCheckData(false)
      }
    };
    fetchAccountData();
  }, [currentPage, modifyLimit]);

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  }

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  }

  const handleSearchFilterParent = (async (search) => {
    if (search) {
      let resSearch;

      if (isToday === "true") {
        // GET TODAY ACCOUNTS
        resSearch = await axios.get(`/v1/accounts/search/today?search=${search}`);
      } else {
        // GET ALL ACCOUNTS
        resSearch = await axios.get(`/v1/accounts/search?search=${search}`);
      }
  
     
      if (resSearch?.data?.length > 0) {
        setCheckData(true);
        setDataSearch(resSearch?.data)
        setCheckSearch(true)
      }
      else {
        setCheckData(true);
        setCheckSearch(true)
        setDataSearch([])
      }
    }
    else {
      setDataSearch([]);
      setCheckSearch(false)
    }
  });

  const handleOnchangeLimit = (limit) => {
    setModifyLimit(limit);
  }
  return (
    <>
      {isLoading ? (
        <Stack spacing={1}>
          {/* For variant="text", adjust the height via font-size */}
          <Skeleton variant="text" sx={{ fontSize: "1rem" }} animation="wave" />
          {/* For other variants, adjust the size with `width` and `height` */}
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="rectangular" width={210} height={60} />
          <Skeleton variant="rounded" width={210} height={60} />
        </Stack>
      ) : (
        <>
          <Box
            sx={{
              width: "100%",
              height: `calc(100vh - ${theme.height.navbar} - 6rem)`,
            }}
          >
            <Typography
              variant="h2"
              sx={{
                color: theme.palette.color.main,
                paddingBottom: "1rem",
              }}
            >
              Danh sách tài khoản đã đăng ký app
            </Typography>
            <Table
              checkAutoFocus={true}
              checkSearch={checkSearch}
              handleSearchFilterParent={handleSearchFilterParent}
              handleOnchangeLimit={handleOnchangeLimit}
              checkData={checkData}
              prevPage={prevPage}
              nextPage={nextPage}
              currentPage={currentPage}
              rows={checkSearch === true ? (dataSearch?.length > 0 ? dataSearch : []) : accounts} 
              columns={accountListColumns}
              showCheckbox={false}
            />
          </Box>
        </>
      )}
    </>
  );
};

export default AccountPage;
