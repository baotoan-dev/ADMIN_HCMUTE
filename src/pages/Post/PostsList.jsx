import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Box, Typography, Stack, Skeleton, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Table, ThemePosts, PendingPosts } from "components";
import { axios } from "configs";
import { postListColumns } from "configs/table";
import { usePermission } from "hooks";
import { IoIosCreate } from "react-icons/io";
import { FaHistory } from "react-icons/fa";

// PAGE
const PostsListPage = () => {
  usePermission();
  const theme = useTheme();
  const [searchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const themeId = searchParams.get("themeId");
  const isToday = searchParams.get("is_today");
  const status = searchParams.get("status");
  const isOwn = searchParams.get("own");
  // GET POSTS LIST
  useEffect(() => {
    const getPostsData = async () => {
      let res;

      if (themeId) {
        // GET POSTS BY THEME
        res = await axios.get(`/v1/posts/theme/all?tid=${themeId}`);
      } else if (isToday === "true" && status === "0") {
        // GET TODAY PENDING POSTS
        res = await axios.get(`/v1/posts/by-admin?is_today=true&status=0`);
      } else if (isToday === "true") {
        // GET TODAY POSTS
        res = await axios.get(`/v1/posts/by-admin?is_today=true`);
      } else if (status === "0") {
        // GET PENDING POSTS
        res = await axios.get(`/v1/posts/by-admin?status=0`);
      } else if (isOwn === "true") {
        // GET OWN POSTS
        res = await axios.get(`/v1/posts/by-admin?is_own=true`);
      } else {
        // GET ALL POSTS
        res = await axios.get(`/v1/posts/by-admin`);
      }

      if (res && res.success) {
        setPosts(res.data);
        setIsLoading(false);
      }
    };
    getPostsData();
  }, [themeId, isToday, status, isOwn]);

  return (
    <Box sx={{
      height: "100vh",
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
                    paddingLeft: "10px",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      marginBottom: "1rem",
                    }}
                  >
                    <Typography
                      variant="h2"
                      sx={{
                        color: theme.palette.color.main,
                        paddingBottom: "1rem",
                      }}
                    >
                      List of posts
                    </Typography>

                    <Box sx={{
                      display: "flex",
                      flexDirection: "row",
                    }}>
                      <Box
                        sx={{
                          marginRight: "10px",
                        }}
                      >
                        {/* <Link to="/admin/post-history">
                          <Button variant="outlined">
                            <FaHistory />
                          </Button>
                        </Link> */}
                      </Box>
                      <Link to="/admin/posts/create">
                        <Button variant="outlined">
                          <IoIosCreate />
                        </Button>
                      </Link>
                    </Box>
                  </Box>

                  <Table type="post" columns={postListColumns} rows={posts} />
                </Box>
              )}
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default PostsListPage;
