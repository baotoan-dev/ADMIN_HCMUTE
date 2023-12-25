import { useState, memo } from "react";
import { toast } from "react-toastify";
import { axios } from "configs";
import {
  Box,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  DialogContent,
  DialogTitle,
  MenuItem,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { useTheme, styled } from "@mui/material/styles";
import { TextField, Dialog } from "components";

const addPhotoTypes = [
  {
    id: 1,
    type: "Upload from device",
  },
];

const bannerTypes = [
  {
    id: 1,
    type: "Move to App Page",
  },
  {
    id: 2,
    type: "Move to Detail Job Info",
  },
  {
    id: 3,
    type: "Open browser with url",
  },
];

const CssFormControl = styled(FormControl)(({ theme }) => ({
  [theme.breakpoints.down("lg")]: {
    width: "100%",
  },
  [theme.breakpoints.up("lg")]: {
    width: "50%",
  },
  padding: "0 1rem",
  marginBottom: "1rem",
  "& .MuiFormLabel-root, & .MuiTypography-root": {
    fontSize: "1rem",
    color: theme.palette.color.main,
  },
  "& .MuiSvgIcon-root": {
    fontSize: 24,
  },
}));

const AddBannerDialog = ({ open, setOpen, setBanners }) => {
  const theme = useTheme();

  const [addPhotoTypeId, setAddPhotoTypeId] = useState(addPhotoTypes[0].id);
  const [previewPhoto, setPreviewPhoto] = useState();
  const [addPhotoError, setAddPhotoError] = useState(false);
  const [photoUrlSelected, setPhotoUrlSelected] = useState("");
  const [photoUploadSelected, setPhotoUploadSelected] = useState();
  const [bannerRedirectUrl, setBannerRedirectUrl] = useState("");
  const [bannerType, setBannerType] = useState(1);
  const [version, setVersion] = useState(1);

  // HANDLE CHANGE PHOTO UPLOAD SELECTED
  const handleChangePhotoUploadSelected = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAddPhotoError(false);
      setPhotoUploadSelected(file);
      setPreviewPhoto(window.URL.createObjectURL(file));
      setPhotoUrlSelected("");
    }
  };

  // HANDLE ADD PHOTO
  const handleAddBanner = async () => {
    // VALIDATION
    // HAS ERROR?
    if (addPhotoError) {
      return toast.warn("Please enter valid url or upload file from device");
    }
    // VALID REDIRECT URL?
    if (!bannerRedirectUrl) {
      return toast.warn("Please enter redirect url");
    }

    // VALID TYPE?
    if (!Number.isInteger(bannerType) || bannerType < 1 || bannerType > 3) {
      return toast.warn("Invalid banner type");
    }

    // DEFINE BODY DATA
    let data = null;
    if (addPhotoTypeId === 0) {
      if (photoUrlSelected.trim()) {
        // HIDE DIALOG
        setOpen(false);

        // RESET
        setPhotoUrlSelected("");
        setPreviewPhoto(null);
        setBannerRedirectUrl("");

        data = {
          imageUrl: photoUrlSelected.trim(),
          redirectUrl: bannerRedirectUrl.trim(),
          type: bannerType,
          version,
        };
      } else {
        return toast.warn("Please enter valid url");
      }
    } else if (addPhotoTypeId === 1) {
      if (photoUploadSelected) {
        // HIDE DIALOG
        setOpen(false);

        // RESET
        setPhotoUploadSelected(null);
        setPreviewPhoto(null);
        setBannerRedirectUrl("");

        data = new FormData();
        data.append("images", photoUploadSelected);
        data.append("redirectUrl", bannerRedirectUrl.trim());
        data.append("type", bannerType);
        data.append("version", version);
      } else {
        return toast.warn("Please upload photo from your device");
      }
    } else {
      return toast.error("Invalid request");
    }

    // CALL API
    const toastId = toast.loading("Please wait...");

    try {
      const res = await axios.post("/v1/banners", data);
      if (res.success) {
        setBanners((prevState) => [
          {
            ...res.data,
            status: 1,
          },
          ...prevState,
        ]);

        setPhotoUploadSelected(null);
        setVersion(1);

        // SHOW SUCCESS TOAST
        return toast.update(toastId, {
          render: "Add banner successfully",
          type: toast.TYPE.SUCCESS,
          closeButton: true,
          closeOnClick: true,
          autoClose: 4000,
          isLoading: false,
        });
      }
    } catch (error) {
      // SHOW ERROR TOAST
      toast.update(toastId, {
        render: "Add banner failure",
        type: toast.TYPE.ERROR,
        closeButton: true,
        closeOnClick: true,
        autoClose: 4000,
        isLoading: false,
      });
    }
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
          <CssFormControl>
            <TextField
              select
              label="Image option"
              value={addPhotoTypeId}
              onChange={(e) => setAddPhotoTypeId(e.target.value)}
            >
              {addPhotoTypes.map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.type}
                </MenuItem>
              ))}
            </TextField>
          </CssFormControl>

          {/* FILE FIELD TO UPLOAD PHOTO */}
          {addPhotoTypeId === 1 && (
            <CssFormControl>
              <Button variant="outlined" component="label">
                Upload File
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => handleChangePhotoUploadSelected(e)}
                />
              </Button>
            </CssFormControl>
          )}

          {/* SELECT BANNER TYPE */}
          <CssFormControl>
            <TextField
              select
              label="Banner type"
              value={bannerType}
              onChange={(e) => setBannerType(e.target.value)}
            >
              {bannerTypes.map((bannerTypes) => (
                <MenuItem key={bannerTypes.id} value={bannerTypes.id}>
                  {bannerTypes.type}
                </MenuItem>
              ))}
            </TextField>
          </CssFormControl>

          {/* BANNER REDIRECT URL */}
          <CssFormControl>
            <TextField
              label="Redirect url"
              variant="outlined"
              value={bannerRedirectUrl}
              onChange={(e) => setBannerRedirectUrl(e.target.value)}
            />
          </CssFormControl>

          {/* BANNER VERSION */}
          <CssFormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">
              Version
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              value={version}
              onChange={(e) => setVersion(Number(e.target.value))}
            >
              <FormControlLabel
                value={1}
                control={<Radio />}
                label="Mobile App"
              />
              <FormControlLabel value={2} control={<Radio />} label="Website" />
            </RadioGroup>
          </CssFormControl>

          {/* PHOTO PREVIEW */}
          <Box
            sx={{
              width: "100%",
              padding: "0 1rem",
              marginBottom: "1rem",
            }}
          >
            <Typography mb={1} sx={{ fontSize: "1.2rem", color: "#eee" }}>
              Preview
            </Typography>
            {addPhotoError ? (
              <Typography sx={{ color: "#eee" }}>Invalid photo url</Typography>
            ) : (
              <img
                width="100%"
                src={`${previewPhoto}`}
                srcSet={`${previewPhoto}`}
                alt=""
                loading="lazy"
                onError={() => {
                  setAddPhotoError(true);
                }}
              />
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ padding: "20px 24px" }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button variant="outlined" size="small" onClick={handleAddBanner}>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default memo(AddBannerDialog);
