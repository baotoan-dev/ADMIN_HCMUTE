import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { toast } from "react-toastify";
import { axios } from "configs";
import { postListColumns } from "configs/table";
import { ConfirmDialog } from "components";
import TablePendingPost from '../Table/TablePendingPost'

const PendingPosts = ({ posts = [], setPosts }) => {
  const theme = useTheme();

  const [postIdsSelections, setPostIdsSelection] = useState([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // HANDLE ACCEPT POSTS
  const handleAcceptPosts = async () => {
    if (postIdsSelections.length < 1) {
      return toast.warn("Please choose post to accept");
    }

    const data = {
      ids: postIdsSelections,
      status: 1,
    };

    const toastId = toast.loading("Please wait...");
    setShowConfirmDialog(false);

    try {
      const res = await axios.put("/v1/posts/sta/many", data);
      if (res && res.success) {
        toast.update(toastId, {
          render: "Accept posts successfully",
          type: toast.TYPE.SUCCESS,
          closeButton: true,
          closeOnClick: true,
          autoClose: 4000,
          isLoading: false,
        });

        // REMOVE FROM ACCEPTED POSTS FROM POSTS LIST
        setPosts((prevState) =>
          prevState.filter((post) => !postIdsSelections.includes(post.id))
        );
      }
    } catch (error) {
      return toast.update(toastId, {
        render: "Accept posts failure",
        type: toast.TYPE.ERROR,
        closeButton: true,
        closeOnClick: true,
        autoClose: 4000,
        isLoading: false,
      });
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: `calc(100vh - ${theme.height.navbar} - 6rem)`,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
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
          PENDING POSTS
        </Typography>

        <Button
          variant="outlined"
          disabled={postIdsSelections.length === 0}
          onClick={() => setShowConfirmDialog(true)}
        >
          Accept
        </Button>
      </Box>

      {/* TABLE */}
      <TablePendingPost
        rows={posts}
        columns={postListColumns}
        showCheckbox={true}
        selectionModel={postIdsSelections}
        onSelectionModelChange={(newPostIdsSelections) => {
          setPostIdsSelection(newPostIdsSelections);
        }}
      />

      {/* DIALOG */}
      <ConfirmDialog
        isOpen={showConfirmDialog && postIdsSelections.length > 0}
        onClose={() => setShowConfirmDialog(false)}
        onClickConfirm={handleAcceptPosts}
        title="Accept posts"
        text="Are you sure?"
      />
    </Box>
  );
};

export default PendingPosts;
