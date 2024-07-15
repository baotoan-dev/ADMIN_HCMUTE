import { useState, useEffect } from "react";
import { Box, Stack } from "@mui/system";
import { Button, Skeleton, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { Table } from "components";
import { workerColumns } from "configs/table";
import { axios } from "configs";
import { usePermission } from "hooks";
import { API_CONSTANT_V3 } from "constant/urlServer";
import userPointHistoriesColumns from "configs/table/userPointHistoryColumn";
import TableUserHistories from "components/Table/TableUserHistories";

const UserPointManager = () => {
  usePermission();
  const theme = useTheme();
  const [histories, setHistories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHistories = async () => {

    const res = await axios.get(`${API_CONSTANT_V3}/v3/user-point-histories`);
    setHistories(res.data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchHistories();
  }, []);

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
        <Box
          sx={{
            width: "100%",
            height: `calc(100vh - ${theme.height.navbar} - 6rem)`,
            paddingLeft: "10px"
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography
              variant="h2"
              sx={{
                color: theme.palette.color.main,
                paddingBottom: "1rem",
              }}
            >
              List of Paying Users
            </Typography>
          </Box>

          <TableUserHistories
            type="account"
            rows={histories}
            columns={userPointHistoriesColumns}
            showCheckbox={false}
          />
        </Box>
      )}
    </>
  );
};

export default UserPointManager;
