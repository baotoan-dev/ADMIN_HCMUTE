import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button, Skeleton, Typography, Box, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Table, LineChart } from "components";
import { axios } from "configs";
import { workerDetailColumns } from "configs/table";
import { usePermission } from "hooks";
import { IoIosCreate } from "react-icons/io";

const WorkerDetail = () => {
  usePermission();
  const theme = useTheme();
  const [searchParams] = useSearchParams();
  const aid = searchParams.get("aid");
  const isOwn = searchParams.get("own");
  const [checkData, setCheckData] = useState(false);
  const [posts, setPosts] = useState([]);
  const [quantityData, setQuantityData] = useState(null);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);

  const fetchPosts = async () => {
    let res;

    if (isOwn === "true") {
      res = await axios.get(`/v1/posts/by-admin?is_own=true`);
    } else if (aid) {
      res = await axios.get(`/v1/posts/by-admin?aid=${aid}`);
    }
    setPosts(res.data);

    if (res?.data?.length > 0) {
      setCheckData(true);
    }
    setIsLoadingPosts(false);
  };

  const fetchQuantity = async () => {
    let res;

    try {
      if (isOwn === "true") {
        res = await axios.get(`/v1/posts/by-admin/count-quantity?is_own=true`);
      } else {
        res = await axios.get(`/v1/posts/by-admin/count-quantity?aid=${aid}`);
      }
    } catch (err) {}
    if (res && res.data) {
      setQuantityData(res.data);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchQuantity();
  }, []);

  return (
    <Box sx={{
      height: "100vh"
    }}>
      {isLoadingPosts ? (
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
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              alignItems: "center",
              paddingBottom: "1rem",
            }}
          >
            <Typography
              variant="h2"
              sx={{
                color: theme.palette.color.main,
              }}
            >
              List of posts
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
            rows={posts}
            type="post"
            checkAutoFocus={true}
            columns={workerDetailColumns}
            showCheckbox={false}
            checkData={checkData}
          />
        </Box>
      )}

      {/* Charts */}
      {/* Area */}
      {quantityData && (
        <Box sx={{ width: "100%", marginTop: "8rem", display: "flex" }}>
          <Box
            sx={{
              width: {
                xs: "100%",
                md: "50%",
              },
            }}
          >
            <LineChart
              data={quantityData.quatity_per_days}
              name="Số bài đăng trong ngày"
            />
          </Box>

          <Box
            sx={{
              width: {
                xs: "100%",
                md: "50%",
              },
            }}
          >
            <LineChart
              data={quantityData.quantity_per_months}
              name="Số bài đăng trong tháng"
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default WorkerDetail;
