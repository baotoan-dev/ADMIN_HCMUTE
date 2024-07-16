import { useState, useEffect } from "react";
import { Box, Stack } from "@mui/system";
import { Button, Skeleton, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { Table } from "components";
import { workerColumns } from "configs/table";
import { axios } from "configs";
import { usePermission } from "hooks";
import { IoIosCreate } from "react-icons/io";

const WorkerManager = () => {
  usePermission();
  const theme = useTheme();
  const [workers, setWorkers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWorkers = async () => {
    const res = await axios.get(`/v1/accounts?role=2`);
    setWorkers(res.data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  return (
    <Box sx={{
      height: "100vh"
    }}>
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
            paddingLeft: "10px",
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
              List of Contributors
            </Typography>

            <Box>
              <Link to="/admin/posts/create">
                <Button variant="outlined">
                  <IoIosCreate />
                </Button>
              </Link>
            </Box>
          </Box>

          <Table
            type="account"
            rows={workers}
            columns={workerColumns}
            showCheckbox={false}
          />
        </Box>
      )}
    </Box>
  );
};

export default WorkerManager;
