import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { toast } from "react-toastify";
import { TextField } from "components";
import { axios } from "configs";
import { ConfirmDialog } from "components";
import { Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import { API_CONSTANT_V3 } from "constant/urlServer";

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

    const toastId = toast.loading("Sending mail...");

    // GET RESPONSE
    try {
      let emailArray = email
        .split("\n")
        .filter((data) => data !== "")
        .map((line) => ({ to: line.trim() }));

      const res = await axios.post(`${API_CONSTANT_V3}/v3/admin/send-mail`, emailArray);
      if (res.statusCode === 200) {
        return toast.update(toastId, {
          render: "Send mail successfully",
          type: toast.TYPE.SUCCESS,
          isLoading: false,
          autoClose: 2000,
        });
      }
    } catch (error) {
      return toast.update(toastId, {
        render: "Send mail failure",
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
        Send mail
      </Typography>

      <Grid container spacing={4}>
        {/* Id */}

        <Grid item xs={12} lg={6}>
          <Item>
            <TextField
              label="Email người nhận"
              variant="outlined"
              multiline
              placeholder="Enter email ..."
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
              Send mail
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
            History (developing feature)
          </Typography>
        </Grid>

        <ConfirmDialog
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onClickConfirm={handleSubmitPostData}
          title="Confirmation send mail"
          text="Are you sure?"
        />
      </Grid>
    </Box>
  );
};

export default SendMailPage;
