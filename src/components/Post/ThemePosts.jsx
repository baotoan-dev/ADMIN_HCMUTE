import { useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { axios } from "configs";
import { postListColumns } from "configs/table";
import { Table, SelectThemePostsDialog } from "components";

const ThemePosts = ({ posts = [], themeId, setPosts }) => {
  const theme = useTheme();

  const [showSelectPostsOfThemeDialog, setShowSelectPostsOfThemeDialog] =
    useState(false);
  const [allPosts, setAllPosts] = useState([]);

  useEffect(() => {
    const fetchAllPosts = async () => {
      const res = await axios.get(`/v1/posts/by-admin`);

      if (res && res.success) {
        setAllPosts(res.data);
      }
    };
    fetchAllPosts();
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        height: `calc(100vh - ${theme.height.navbar} - 8rem)`,
      }}
    >
      <Typography
        variant="h2"
        sx={{
          color: theme.palette.color.main,
          paddingBottom: "1rem",
        }}
      >
        POSTS OF THEME
      </Typography>
      <Button onClick={() => setShowSelectPostsOfThemeDialog(true)}>
        Add/Remove posts
      </Button>

      <Table rows={posts} columns={postListColumns} showCheckbox={false} />

      {allPosts.length > 0 && <SelectThemePostsDialog
        themeId={themeId}
        open={showSelectPostsOfThemeDialog}
        setOpen={setShowSelectPostsOfThemeDialog}
        allPosts={allPosts}
        postsOfTheme={posts}
        setPostsOfTheme={setPosts}
      />}
    </Box>
  );
};

export default ThemePosts;
