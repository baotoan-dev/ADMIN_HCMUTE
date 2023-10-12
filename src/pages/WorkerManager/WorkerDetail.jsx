import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button, Skeleton, Typography, Box, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Table, LineChart } from "components";
import { axios } from "configs";
import { workerDetailColumns } from "configs/table";
import { usePermission } from "hooks";

const WorkerDetail = () => {
  usePermission();
  const theme = useTheme();
  const [searchParams] = useSearchParams();
  const aid = searchParams.get("aid");
  const isOwn = searchParams.get("own");
  const [modifyLimit, setModifyLimit] = useState(10)
  const [checkData, setCheckData] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const [quantityData, setQuantityData] = useState(null);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [dataSearch, setDataSearch] = useState('')
  const [checkSearch, setCheckSearch] = useState(false);

  const fetchPosts = async () => {
    let res;

    let limitNumber = +modifyLimit ? +modifyLimit : 10

    if (isOwn === "true") {
      res = await axios.get(`/v1/posts/by-admin?is_own=true&page=${currentPage}&limit=${limitNumber}`);
    } else if (aid) {
      res = await axios.get(`/v1/posts/by-admin?aid=${aid}&page=${currentPage}&limit=${limitNumber}`);
    }
    setPosts(res.data);

    if (res?.data?.length > 0){
      setCheckData(true);
    }
    setIsLoadingPosts(false);
  };

  const fetchQuantity = async () => {
    let res;

    try
    {
      if (isOwn === "true") {
        res = await axios.get(`/v1/posts/by-admin/count-quantity?is_own=true`);
      } else {
        res = await axios.get(`/v1/posts/by-admin/count-quantity?aid=${aid}`);
      }
    }catch(err)
    {

    }
    if (res && res.data) {
      setQuantityData(res.data);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchQuantity();
  }, [currentPage, modifyLimit]);

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  }

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  }

  const handleOnchangeLimit = (limit) => {
    setModifyLimit(limit);
  }

  const handleSearchFilterParent = (async (search) => {
    if (search) {
      let resSearch;
      
      if (isOwn === "true") {
        resSearch = await axios.get(`/v1/posts/admin/search?search=${search}&is_own=true`);
      } else if (aid) {
        resSearch = await axios.get(`/v1/posts/admin/search?search=${search}&aid=${aid}`);
      }
     
      if (resSearch?.data?.length > 0) {
        setCheckData(true);
        setCheckSearch(true)
        setDataSearch(resSearch?.data)
      }
      else {
        setCheckData(true);
        setCheckSearch(true)
        setDataSearch([])
      }
    }

    else
    {
      setDataSearch([])
      setCheckSearch(false)
    }
  });

  return (
    <>
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
            }}
          >
            <Typography
              variant="h2"
              sx={{
                color: theme.palette.color.main,
                paddingBottom: "1rem",
              }}
            >
              Danh sách bài đăng
            </Typography>

            <Box>
              <Link to="/admin/posts/create">
                <Button variant="outlined">Tạo bài đăng</Button>
              </Link>
            </Box>
          </Box>

          <Table 
            handleOnchangeLimit={handleOnchangeLimit}
            handleSearchFilterParent={handleSearchFilterParent}
            rows={checkSearch === true ? (dataSearch?.length > 0 ? dataSearch : []) : posts} 
            checkAutoFocus={true}
            checkSearch={checkSearch}
            columns={workerDetailColumns} 
            showCheckbox={false} 
            checkData={checkData}
            currentPage={currentPage}
            prevPage={prevPage}
            nextPage={nextPage}
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
    </>
  );
};

export default WorkerDetail;
