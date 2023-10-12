import { useState, memo } from "react";
import { toast } from "react-toastify";
import {
  FormControl,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  MenuItem,
  Box,
  Typography,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { useTheme, styled } from "@mui/material/styles";

import { axios } from "configs";
import { TextField, Dialog } from "components";

const addPhotoTypes = [
  {
    id: 0,
    type: "Enter url",
  },
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

const EditBannerDialog = ({
  open,
  setOpen,
  bannerSelected,
  setBannerSelected,
  setBanners,
}) => {
  const theme = useTheme();

  const [addPhotoTypeId, setAddPhotoTypeId] = useState(addPhotoTypes[0].id);
  const [previewPhoto, setPreviewPhoto] = useState(
    bannerSelected ? bannerSelected.image : ""
  );
  const [addPhotoError, setAddPhotoError] = useState(false);
  const [photoUploadSelected, setPhotoUploadSelected] = useState();

  // HANDLE CHANGE PHOTO URL SELECTED
  const handleChangePhotoUrlSelected = (e) => {
    setAddPhotoError(false);

    setBannerSelected((prevState) => ({
      ...prevState,
      image: e.target.value,
    }));

    if (previewPhoto) {
      window.URL.revokeObjectURL(previewPhoto);
      setPreviewPhoto(null);
    }
  };

  // HANDLE CHANGE PHOTO UPLOAD SELECTED
  const handleChangePhotoUploadSelected = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAddPhotoError(false);
      setPhotoUploadSelected(file);
      setPreviewPhoto(window.URL.createObjectURL(file));
      // setPhotoUrlSelected("");
      setBannerSelected((prevState) => ({
        ...prevState,
        image: null,
      }));
    }
  };

  // HANDLE ON CLOSE DIALOG
  const handleOnCloseDialog = () => {
    setBannerSelected(null);
    setOpen(false);
  };

  // HANDLE SUBMIT BANNER REDIRECT URL
  const handleSubmitToEditBanner = async () => {
    // VALIDATION
    // HAS ERROR?
    if (addPhotoError) {
      return toast.warn("Please enter valid url or upload file from device");
    }
    // VALID REDIRECT URL?
    if (!bannerSelected.redirect_url) {
      return toast.warn("Please enter banner redirect url");
    }

    // VALID TYPE?
    if (
      !Number.isInteger(bannerSelected.type) ||
      bannerSelected.type < 1 ||
      bannerSelected.type > 3
    ) {
      return toast.warn("Invalid banner type");
    }

    // VALID VERSION?
    if (
      !Number.isInteger(bannerSelected.version) ||
      bannerSelected.version < 1 ||
      bannerSelected.version > 2
    ) {
      return toast.warn("Invalid banner version");
    }

    //  DEFINE BODY DATA
    let data = null;
    if (addPhotoTypeId === 0) {
      // UPDATE BANNER WITH IMAGE URL
      if (bannerSelected.image.trim()) {
        // HIDE DIALOG
        setOpen(false);

        // RESET
        setPreviewPhoto(null);

        data = {
          id: bannerSelected.id,
          redirectUrl: bannerSelected.redirect_url,
          imageUrl: bannerSelected.image.trim(),
          type: bannerSelected.type,
          version: bannerSelected.version,
        };
      } else {
        return toast.warn("Please enter valid url");
      }
    } else if (addPhotoTypeId === 1) {
      // UPDATE BANNER WITH UPLOADED IMAGE
      if (photoUploadSelected) {
        // HIDE DIALOG
        setOpen(false);

        // RESET
        setPhotoUploadSelected(null);
        setPreviewPhoto(null);

        data = new FormData();
        data.append("id", bannerSelected.id);
        data.append("redirectUrl", bannerSelected.redirect_url);
        data.append("images", photoUploadSelected);
        data.append("type", bannerSelected.type);
        data.append("version", bannerSelected.version);
      } else {
        return toast.warn("Please upload photo from your device");
      }
    } else {
      return toast.error("Invalid request");
    }

    // CALL API
    const toastId = toast.loading("Please wait...");

    try {
      const res = await axios.put("v1/banners", data);
      if (res.success) {
        setBanners((prevState) => {
          const newState = [...prevState];
          const index = newState.findIndex(
            (item) => item.id === bannerSelected.id
          );
          newState[index].image = res.data.image;
          newState[index].type = bannerSelected.type;
          newState[index].redirect_url = bannerSelected.redirect_url;
          newState[index].version = bannerSelected.version;
          return newState;
        });

        setBannerSelected(null);

        // SHOW SUCCESS TOAST
        return toast.update(toastId, {
          render: "Update banner successfully",
          type: toast.TYPE.SUCCESS,
          closeButton: true,
          closeOnClick: true,
          autoClose: 4000,
          isLoading: false,
        });
      }
    } catch (error) {
      setBannerSelected(null);
      return toast.update(toastId, {
        render: "Update banner failure",
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
      <Dialog disableEscapeKeyDown open={open} onClose={handleOnCloseDialog}>
        <DialogTitle
          color={theme.palette.color.main}
          variant="h4"
          sx={{ padding: "20px 24px" }}
        >
          Edit banner dialog
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
          {/* SELECT ADD PHOTO TYPE */}
          <CssFormControl>
            <TextField
              select
              label="Type"
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

          {/* TEXT FIELD TO ENTER URL */}
          {addPhotoTypeId === 0 && (
            <CssFormControl>
              <TextField
                label="Photo url"
                variant="outlined"
                // value={photoUrlSelected}
                value={bannerSelected.image || ""}
                onChange={(e) => handleChangePhotoUrlSelected(e)}
              />
            </CssFormControl>
          )}

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
              value={bannerSelected.type || ""}
              onChange={(e) =>
                setBannerSelected((prevState) => ({
                  ...prevState,
                  type: e.target.value,
                }))
              }
            >
              {bannerTypes.map((bannerType) => (
                <MenuItem key={bannerType.id} value={bannerType.id}>
                  {bannerType.type}
                </MenuItem>
              ))}
            </TextField>
          </CssFormControl>

          {/* REDIRECT URL */}
          <CssFormControl>
            <TextField
              label="Redirect url"
              variant="outlined"
              value={bannerSelected.redirect_url || ""}
              onChange={(e) =>
                setBannerSelected((prevState) => ({
                  ...prevState,
                  redirect_url: e.target.value,
                }))
              }
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
              value={bannerSelected.version || 1}
              onChange={(e) =>
                setBannerSelected((prevState) => ({
                  ...prevState,
                  version: Number(e.target.value),
                }))
              }
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
                src={`${bannerSelected.image || previewPhoto || ""}`}
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
          <Button variant="outlined" size="small" onClick={handleOnCloseDialog}>
            Cancel
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={handleSubmitToEditBanner}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default memo(EditBannerDialog);
