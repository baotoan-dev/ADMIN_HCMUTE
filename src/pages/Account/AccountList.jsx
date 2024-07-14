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
  const [isLoading, setIsLoading] = useState(true);

  // GET ALL ACCOUNTS
  useEffect(() => {
    const fetchAccountData = async () => {
      let res;

      if (isToday === "true") {
        // GET TODAY ACCOUNTS
        res = await axios.get(`/v1/accounts/today`);
      } else {
        // GET ALL ACCOUNTS
        res = await axios.get(`/v1/accounts`);
      }
      if (res && res.success) {
        setAccounts(res.data);
        setIsLoading(false);
      }
    }
    fetchAccountData();
  }, [isToday]);

  console.log(accounts);

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
              paddingLeft: "10px"
            }}
          >
            <Typography
              variant="h2"
              sx={{
                color: theme.palette.color.main,
                paddingBottom: "1rem",
              }}
            >
              List of registered accounts
            </Typography>
            <Table
              checkAutoFocus={true}
              rows={accounts}
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
