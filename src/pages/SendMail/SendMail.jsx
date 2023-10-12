import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { toast } from "react-toastify";
import { TextField } from "components";
import { axios } from "configs";
import { ConfirmDialog } from "components";
import { Grid } from "@mui/material";
import { styled } from "@mui/material/styles";

const Item = styled(Box)(({ theme }) => ({
  textarea: {
    fontSize: "1rem",
  },
}));

const SendMailPage = () => {
  const theme = useTheme();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [email, setEmail] = useState("");

  // GET POST DATA

  // HANDLE SUBMIT
  const handleSubmitPostData = async () => {
    // HIDE MODAL
    setShowConfirmModal(false);

    const toastId = toast.loading("Đang gửi mail...");

    // GET RESPONSE
    try {
      let emailArray = email
        .split("\n")
        .filter((data) => data !== "")
        .map((line) => ({ to: line.trim() }));

      const res = await axios.post(`/v3/admin/send-mail`, emailArray);
      if (res.statusCode === 200) {
        return toast.update(toastId, {
          render: "Gửi mail thành công",
          type: toast.TYPE.SUCCESS,
          isLoading: false,
          autoClose: 2000,
        });
      }
    } catch (error) {
      return toast.update(toastId, {
        render: "Gửi mail thất bại",
        type: toast.TYPE.ERROR,
        isLoading: false,
        autoClose: 2000,
      });
    }

    toast.dismiss();
  };

  return (
    <Box sx={{ padding: "1rem" }}>
      <Typography
        variant="h3"
        style={{ marginBottom: "3rem" }}
        color={theme.palette.color.main}
      >
        Gửi Mail
      </Typography>

      <Grid container spacing={4}>
        {/* Id */}

        <Grid item xs={12} lg={6}>
          <Item>
            <TextField
              label="Email người nhận"
              variant="outlined"
              multiline
              placeholder="Nhập email người nhận..."
              value={email || ""}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              fullWidth
            />
          </Item>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Item>
            <Button
              variant="outlined"
              onClick={() => setShowConfirmModal(true)}
            >
              Gửi mail
            </Button>
          </Item>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Typography
            variant="h3"
            style={{ marginBottom: "3rem" }}
            color={theme.palette.color.main}
            marginTop={2}
          >
            History (Coming soon)
          </Typography>
        </Grid>

        <ConfirmDialog
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onClickConfirm={handleSubmitPostData}
          title="Xác nhận gửi mail"
          text="Bạn có chắc chắn muốn gửi mail không?"
        />
      </Grid>
    </Box>
  );
};

export default SendMailPage;
