import { useState, useEffect, memo } from "react";
import { toast } from "react-toastify";
import {
  Box,
  FormControl,
  DialogContent,
  DialogTitle,
  MenuItem,
  DialogActions,
  Button,
  Typography,
  InputLabel,
  Select,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Chip,
} from "@mui/material";
import { useTheme, styled } from "@mui/material/styles";
import { TextField, Dialog } from "components";
import { axios } from "configs";

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

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const CssSelect = styled(Select)(({ theme }) => ({
  backgroundColor: theme.palette.background.content,
  color: theme.palette.color.main,

  "& fieldset": {
    borderColor: theme.palette.color.border,
  },
  "&:hover > fieldset": {
    borderColor: theme.palette.color.border,
  },
  "&.Mui-focused fieldset": {
    borderColor: theme.palette.color.primary,
  },
  "& input": {
    color: theme.palette.color.main,
    fontSize: "1rem",
  },

  "& .MuiSelect-outlined": {
    color: theme.palette.color.main,
    fontSize: "1rem",
  },
}));

const CssListItemText = styled(ListItemText)(({ theme }) => ({
  "& .MuiTypography-root": {
    fontSize: "1rem",
  },
}));

const AddThemeDialog = ({ open, setOpen, setEnabledThemes }) => {
  const theme = useTheme();

  const [addPhotoTypeId, setAddPhotoTypeId] = useState(addPhotoTypes[0].id);
  const [previewPhoto, setPreviewPhoto] = useState();
  const [addPhotoError, setAddPhotoError] = useState(false);
  const [photoUrlSelected, setPhotoUrlSelected] = useState("");
  const [photoUploadSelected, setPhotoUploadSelected] = useState();
  const [themeTitle, setThemeTitle] = useState("");
  const [allLocations, setAllLocations] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [provinceIdSelected, setProvinceIdSelected] = useState(null);
  const [districts, setDistricts] = useState([]);
  const [locationsSelected, setLocationsSelected] = useState([]);

  // USE EFFECT
  useEffect(() => {
    // GET LOCATIONS
    const fetchAllLocations = async () => {
      const res = await axios.get("/v1/locations");
      if (res.success) {
        setAllLocations(res.data);
        setProvinces(
          res.data.map((location) => ({
            province_id: location.province_id,
            province_name: location.province_name,
          }))
        );
        setProvinceIdSelected(res.data[0].province_id);
      }
    };
    fetchAllLocations();
  }, []);

  // HANDLE CHANGE PHOTO URL SELECTED
  const handleOnChangeDistrictsPhotoUrlSelected = (e) => {
    setPhotoUrlSelected(e.target.value);
    setPreviewPhoto(e.target.value);
    setAddPhotoError(false);
    if (photoUploadSelected) {
      window.URL.revokeObjectURL(photoUploadSelected);
      setPhotoUploadSelected(null);
    }
  };

  // HANDLE CHANGE PHOTO UPLOAD SELECTED
  const handleOnChangeDistrictsPhotoUploadSelected = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAddPhotoError(false);
      setPhotoUploadSelected(file);
      setPreviewPhoto(window.URL.createObjectURL(file));
      setPhotoUrlSelected("");
    }
  };

  // HANDLE ADD THEME
  const handleAddTheme = async () => {
    // VALIDATION
    // HAS ERROR?
    if (addPhotoError) {
      return toast.warn("Please enter valid url or upload file from device");
    }
    // VALID REDIRECT URL?
    if (!themeTitle) {
      return toast.warn("Please enter theme title");
    }

    // DEFINE BODY DATA
    let data = null;
    if (addPhotoTypeId === 0) {
      // CREATE THEME WITH IMAGE URL
      if (photoUrlSelected.trim()) {
        // HIDE DIALOG
        setOpen(false);

        // RESET
        setPhotoUrlSelected("");
        setPreviewPhoto(null);
        setThemeTitle("");

        data = {
          imageUrl: photoUrlSelected.trim(),
          title: themeTitle,
          districtIds: locationsSelected.map(
            (location) => location.district_id
          ),
        };
      } else {
        return toast.warn("Please enter valid url");
      }
    } else if (addPhotoTypeId === 1) {
      // CREATE THEME WITH UPLOADED IMAGE
      if (photoUploadSelected) {
        // HIDE DIALOG
        setOpen(false);

        // RESET
        setPhotoUploadSelected(null);
        setPreviewPhoto(null);
        setThemeTitle("");

        data = new FormData();
        data.append("images", photoUploadSelected);
        data.append("title", themeTitle);
        data.append(
          "districtIds",
          locationsSelected.map((location) => location.district_id)
        );
      } else {
        return toast.warn("Please upload photo from your device");
      }
    } else {
      return toast.error("Invalid request");
    }

    // ADD LOADING TOAST FOR HANDLE CALL API
    const toastId = toast.loading("Please wait...");

    // CALL API
    try {
      const res = await axios.post("/v1/themes", data);
      if (res.success) {
        setEnabledThemes((prevState) => [
          {
            ...res.data,
            status: 1,
          },
          ...prevState,
        ]);
        // SHOW SUCCESS TOAST
        toast.update(toastId, {
          render: "Create theme successfully",
          type: toast.TYPE.SUCCESS,
          closeButton: true,
          closeOnClick: true,
          autoClose: 4000,
          isLoading: false,
        });
        return setPhotoUploadSelected(null);
      }
    } catch (error) {
      return toast.update(toastId, {
        render: "Create theme failure",
        type: toast.TYPE.ERROR,
        closeButton: true,
        closeOnClick: true,
        autoClose: 4000,
        isLoading: false,
      });
    }
  };

  // Set districts when change province
  useEffect(() => {
    if (provinceIdSelected) {
      const districtsOfProvince = allLocations.find(
        (location) => location.province_id === provinceIdSelected
      ).districts;

      setDistricts(districtsOfProvince);
    }
  }, [provinceIdSelected]);

  // Handle change district
  const handleOnChangeDistrict = (e) => {
    if (e.target.value.length > locationsSelected.length) {
      const districtIdSelected = e.target.value[e.target.value.length - 1];
      const index = e.target.value.indexOf(districtIdSelected);
      if (index >= 0 && index < e.target.value.length - 1) {
        setLocationsSelected((prevState) => prevState.splice(index, 1));
      } else {
        const districtSelected = districts.find(
          (district) => district.district_id === districtIdSelected
        );
        const provinceSelected = provinces.find(
          (province) => province.province_id === provinceIdSelected
        );
        if (districtSelected && provinceSelected) {
          setLocationsSelected((prevState) => [
            ...prevState,
            {
              province_id: provinceSelected.province_id,
              province: provinceSelected.province_name,
              district_id: districtSelected.district_id,
              district: districtSelected.district,
            },
          ]);
        }
      }
    } else {
      // Find removed element
      setLocationsSelected((prevState) =>
        prevState.filter((prevStateLocation) =>
          e.target.value.includes(prevStateLocation.district_id)
        )
      );
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
          Add theme dialog
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
          >
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
          </FormControl>

          {/* TEXT FIELD TO ENTER URL */}
          {addPhotoTypeId === 0 && (
            <FormControl
              sx={{
                width: {
                  xs: "100%",
                  lg: "50%",
                },
                padding: "0 1rem",
                marginBottom: "1rem",
              }}
            >
              <TextField
                label="Photo url"
                variant="outlined"
                value={photoUrlSelected}
                onChange={(e) => handleOnChangeDistrictsPhotoUrlSelected(e)}
              />
            </FormControl>
          )}

          {/* FILE FIELD TO UPLOAD PHOTO */}
          {addPhotoTypeId === 1 && (
            <FormControl
              sx={{
                width: {
                  xs: "100%",
                  lg: "50%",
                },
                padding: "0 1rem",
                marginBottom: "1rem",
              }}
            >
              <Button variant="outlined" component="label">
                Upload File
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) =>
                    handleOnChangeDistrictsPhotoUploadSelected(e)
                  }
                />
              </Button>
            </FormControl>
          )}

          {/* THEME TITLE */}
          <FormControl
            sx={{
              width: "100%",
              padding: "0 1rem",
              marginBottom: "1rem",
            }}
          >
            <TextField
              label="Title"
              variant="outlined"
              value={themeTitle}
              onChange={(e) => setThemeTitle(e.target.value)}
            />
          </FormControl>

          {/* SELECT LOCATIONS */}
          {/* PROVINCE */}
          <FormControl
            sx={{
              width: {
                xs: "100%",
                lg: "50%",
              },
              padding: "0 1rem",
              marginBottom: "1rem",
            }}
          >
            <TextField
              select
              label="Province"
              value={provinceIdSelected ? provinceIdSelected : ""}
              onChange={(e) => setProvinceIdSelected(e.target.value)}
            >
              {provinces.map((province) => (
                <MenuItem
                  key={province.province_id}
                  value={province.province_id}
                >
                  {province.province_name}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>

          <FormControl
            sx={{
              width: {
                xs: "100%",
                lg: "50%",
              },
              padding: "0 1rem",
              marginBottom: "1rem",
            }}
          >
            <InputLabel
              id="demo-multiple-checkbox-label"
              sx={{
                color: theme.palette.color.main,
                fontSize: "1rem",
                left: "1rem",
                backgroundColor: "transparent",
                "& .Mui-focused": {
                  color: theme.palette.color.primary,
                },
              }}
            >
              Districts/Cities
            </InputLabel>
            <CssSelect
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              multiple
              value={locationsSelected.map((location) => location.district_id)}
              onChange={handleOnChangeDistrict}
              input={<OutlinedInput label="Tag" />}
              renderValue={() => (
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                  }}
                >
                  {locationsSelected.map((location) => (
                    <Chip
                      key={location.district_id}
                      label={`${location.province} (${location.district})`}
                    />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {districts.map((district) => (
                <MenuItem
                  key={district.district_id}
                  value={district.district_id}
                >
                  <Checkbox
                    checked={locationsSelected
                      .map((location) => location.district_id)
                      .includes(district.district_id)}
                    size="small"
                  />
                  <CssListItemText primary={district.district} />
                </MenuItem>
              ))}
            </CssSelect>
          </FormControl>

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
          <Button variant="outlined" size="small" onClick={handleAddTheme}>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default memo(AddThemeDialog);
