import { useState, memo } from "react";
import {
  FormControl,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Dialog, Snackbar } from "components";

const EditPersonalInformationDialog = ({ open, setOpen }) => {
  const theme = useTheme();

  const [previewPhoto, setPreviewPhoto] = useState();
  const [addPhotoError, setAddPhotoError] = useState(false);
  const [photoUrlSelected, setPhotoUrlSelected] = useState("");
  const [photoUploadSelected, setPhotoUploadSelected] = useState();
  const [bannerRedirectUrl, setBannerRedirectUrl] = useState("");

  // console.log(">>> addPhotoError: ", addPhotoError);

  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  // SHOW SNACKBAR
  const showSnackbar = (severity, message) => {
    setSnackbar({
      open: true,
      severity,
      message,
    });
  };

  return (
    <>
      <Dialog disableEscapeKeyDown open={open} onClose={() => setOpen(false)}>
        <DialogTitle
          color={theme.palette.color.main}
          variant="h4"
          sx={{ padding: "20px 24px" }}
        >
          Add new banner
        </DialogTitle>

        <DialogContent
          sx={{
            display: "flex",
            flexWrap: "wrap",
            padding: "20px 24px 0px 24px !important",
            margin: "0 -1rem !important",
            borderTop: theme.palette.border,
            borderBottom: theme.palette.border,
          }}
        >
          {/* FORM */}
          {/* SELECT ADD PHOTO TYPE */}
          <FormControl
            sx={{
              width: {
                xs: "100%",
                lg: "50%",
              },
              padding: "0 1rem",
              marginBottom: "1rem",
            }}
          ></FormControl>
        </DialogContent>

        <DialogActions sx={{ padding: "20px 24px" }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button variant="outlined" size="small" onClick={() => {}}>
            Ok
          </Button>
        </DialogActions>
      </Dialog>

      {/* SNACKBAR */}
      <Snackbar
        open={snackbar.open}
        onClose={() =>
          setSnackbar((prevState) => ({
            ...prevState,
            open: false,
          }))
        }
        severity={snackbar.severity}
        message={snackbar.message}
      />
    </>
  );
};

export default memo(EditPersonalInformationDialog);
