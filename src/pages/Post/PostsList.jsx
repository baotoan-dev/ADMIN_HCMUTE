import { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Box, Typography, Stack, Skeleton, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { Table, ThemePosts, PendingPosts } from "components";
import { axios } from "configs";
import { postListColumns } from "configs/table";
import { usePermission } from "hooks";

// PAGE
const PostsListPage = () => {
  usePermission();
  const theme = useTheme();
  const [searchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // const [totalPages, setTotalPages] = useState(1);
  const [modifyLimit, setModifyLimit] = useState(10)
  const [checkData, setCheckData] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const themeId = searchParams.get("themeId");
  const isToday = searchParams.get("is_today");
  const status = searchParams.get("status");
  const isOwn = searchParams.get("own");
  const [dataSearch, setDataSearch] = useState('')
  const [checkSearch, setCheckSearch] = useState(false);
  // GET POSTS LIST
  useEffect(() => {
    const getPostsData = async () => {
      let res;

      let limitNumber = +modifyLimit ? +modifyLimit : 10

      if (themeId) {
        // GET POSTS BY THEME
        res = await axios.get(`/v1/posts/theme/all?tid=${themeId}`);
      } else if (isToday === "true" && status === "0") {
        // GET TODAY PENDING POSTS
        res = await axios.get(`/v1/posts/by-admin?is_today=true&status=0&page=${currentPage}&limit=${limitNumber}`);
      } else if (isToday === "true") {
        // GET TODAY POSTS
        res = await axios.get(`/v1/posts/by-admin?is_today=true&page=${currentPage}&limit=${limitNumber}`);
      } else if (status === "0") {
        // GET PENDING POSTS
        res = await axios.get(`/v1/posts/by-admin?status=0&page=${currentPage}&limit=${limitNumber}`);
      } else if (isOwn === "true") {
        // GET OWN POSTS
        res = await axios.get(`/v1/posts/by-admin?is_own=true&page=${currentPage}&limit=${limitNumber}`);
      } else {
        // GET ALL POSTS
        res = await axios.get(`/v1/posts/by-admin?page=${currentPage}&limit=${limitNumber}`);
      }

      if (res && res.success) {
        // setTotalPages(res.totalPosts);

        if (res?.data?.length > 0)
        {
          setCheckData(true);
        }
        setPosts(res.data);
        setIsLoading(false);
      }

      else {
        setCheckData(false);
      }
    };
    getPostsData();
  }, [themeId, isToday, status, currentPage, modifyLimit]);

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  }

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  }  

  const handleSearchFilterParent = (async (search) => {
    if (search !== '') {
      let resSearch;
      if (themeId) {
        // GET POSTS BY THEME
        // resSearch = await axios.get(`/v1/posts/theme/all?tid=${themeId}&page=${currentPage}&limit=${limitNumber}`);
      } else if (isToday === "true" && status === "0") {
        // GET TODAY PENDING POSTS
        resSearch = await axios.get(`/v1/posts/admin/search?search=${search}&is_today=true&status=0`);
      } else if (isToday === "true") {
        // GET TODAY POSTS
        resSearch = await axios.get(`/v1/posts/admin/search?search=${search}&is_today=true`);
      } else if (status === "0") {
        // GET PENDING POSTS
        resSearch = await axios.get(`/v1/posts/admin/search?search=${search}&status=0`);
      } else if (isOwn === "true") {
        // GET OWN POSTS
        resSearch = await axios.get(`/v1/posts/admin/search?search=${search}&is_own=true`);
      } else {
        // SEARCH ALL POSTS
        resSearch = await axios.get(`/v1/posts/admin/search?search=${search}`);
      }

      if (resSearch?.data?.length > 0) {
        setCheckSearch(true)
        setCheckData(true);
        setDataSearch(resSearch?.data)
      }
      else {
        setCheckSearch(true)
        setDataSearch([])
        setCheckData(true);
     }
    }

    else
    {
      setDataSearch([])
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
          {themeId ? (
            // Theme posts
            <ThemePosts posts={posts} themeId={themeId} setPosts={setPosts} />
          ) : (
            <>
              {status === "0" ? (
                // Pending posts
                <PendingPosts posts={posts} setPosts={setPosts} />
              ) : (
                // All posts
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
                    // totalPages={totalPages}
                    checkAutoFocus={true}
                    checkSearch={checkSearch}
                    handleOnchangeLimit={handleOnchangeLimit}
                    handleSearchFilterParent={handleSearchFilterParent}
                    checkData={checkData}
                    prevPage={prevPage}
                    nextPage={nextPage}
                    currentPage={currentPage}
                    rows={checkSearch === true ? (dataSearch?.length > 0 ? dataSearch : []) : posts} 
                    columns={postListColumns}
                    showCheckbox={false}
                  />
                </Box>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default PostsListPage;
