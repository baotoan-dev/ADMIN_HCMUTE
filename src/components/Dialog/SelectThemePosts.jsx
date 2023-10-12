import React, { useState, memo } from "react";
import { styled } from "@mui/material/styles";
import { axios } from "configs";
import {
  Grid,
  Box,
  MenuItem,
  TextField,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
} from "@mui/material";
// import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { useTheme } from "@mui/material/styles";
import { toast } from "react-toastify";
import { Table, Dialog } from "components";
import { postListColumns } from "configs/table";
import { fetchAllLocations } from "api";
import "./SelectThemePosts.scss";

const Item = styled(Box)(({ theme }) => ({
  textarea: {
    fontSize: "1rem",
  },
}));

const SelectThemePostsDialog = ({
  themeId,
  open,
  setOpen,
  allPosts,
  postsOfTheme,
  setPostsOfTheme,
}) => {
  const theme = useTheme();

  // console.log("allPosts", allPosts);

  // POST SELECTION
  const [postIdsSelections, setPostIdsSelection] = useState([]);

  const [filteredPosts, setFilteredPosts] = useState([]);

  const handleOnSubmit = async () => {
    setOpen(false);

    const data = {
      themeId,
      postIds: postIdsSelections,
    };

    if (postIdsSelections.length > 0) {
      try {
        await axios.post("/v1/themes/add-posts", data);
        setPostsOfTheme(
          allPosts.filter((post) => postIdsSelections.includes(post.id))
        );
        return toast.success("Add/Remove posts of theme successfully");
      } catch (error) {
        return toast.error("Add/Remove posts of theme failure");
      }
    }
  };

  const [selectedProvinceId, setSelectedProvinceId] = useState("");
  const [selectedDistrictId, setSelectedDistrictId] = useState("");
  const [selectedWardId, setSelectedWardId] = useState("");
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [locations, setLocations] = useState([]);

  const handleOnChangeProvince = (e) => {
    const selectedProvinceIdValue = e.target.value;
    setSelectedProvinceId(selectedProvinceIdValue.toString());
    const province = locations.find(
      (location) => location.province_id === selectedProvinceIdValue.toString()
      );
    

    if (province) {
      const filteredPostTemp = allPosts.filter((post) => {
        return post.province_id === selectedProvinceIdValue;
      });
      setFilteredPosts(filteredPostTemp);
      setDistricts(province.districts);
    }

  };

  const handleOnChangeDistrict = (e) => {
    const selectedDistrictIdTarget = e.target.value;
    setSelectedDistrictId(selectedDistrictIdTarget);
    const district = districts.find(
      (district) => district.district_id === selectedDistrictIdTarget
    );

    if (district) {
      const filteredPostTemp = allPosts.filter((post) => {
        return post.district_id === selectedDistrictIdTarget;
      });

      setFilteredPosts(filteredPostTemp);

      setWards(district.wards);
    }
  };

  const handleOnChangeWard = (e) => {
    const selectedWardIdValue = e.target.value;


    const filteredPostTemp = allPosts.filter((post) => {
      return post.ward_id === selectedWardIdValue;
    });
    setFilteredPosts(filteredPostTemp);
    setSelectedWardId(selectedWardIdValue);
  };

  const getLocation = async () => {
    if (locations.length > 0) return;
    const location = await fetchAllLocations();
    setLocations(location);
  };


  React.useEffect(() => {
    setPostIdsSelection(postsOfTheme.map((post) => post.id));
    setFilteredPosts(allPosts);
    if (locations.length === 0) {
      getLocation();
    }
  }, [postsOfTheme]);

  return (
    <>
      <Dialog disableEscapeKeyDown open={open} onClose={() => setOpen(false)}>
        <div style={{ padding: "1rem" }} className="">
          <DialogTitle variant="h4" sx={{ padding: "20px 24px" }}>
            Select posts
          </DialogTitle>
          <div className="location__dropdown">
            <Box>
              <Grid container xs={12} spacing={4}>
                <Grid item lg={4}>
                  <TextField
                    label="Tỉnh/Thành phố"
                    variant="outlined"
                    value={selectedProvinceId !== "" ? selectedProvinceId.toString() : ""}
                    onChange={handleOnChangeProvince}
                    fullWidth
                    select
                  >
                    {locations.map((location) => (
                      <MenuItem
                        key={location.province_id}
                        value={location.province_id.toString()}
                      >
                        {location.province_name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* District */}
                <Grid item lg={4}>
                  <Item>
                    <TextField
                      label="Quận/Huyện"
                      variant="outlined"
                      value={selectedDistrictId !== "" ? selectedDistrictId : ""}
                      onChange={handleOnChangeDistrict}
                      fullWidth
                      select
                    >
                      {districts.map((district) => (
                        <MenuItem
                          key={district.district_id}
                          value={district.district_id}
                        >
                          {district.district}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Item>
                </Grid>

                {/* Ward */}
                <Grid item lg={4}>
                  <TextField
                    label="Phường/Xã"
                    variant="outlined"
                    onChange={handleOnChangeWard}
                    fullWidth
                    select
                  >
                    {wards.map((ward) => (
                      <MenuItem key={ward.id} value={ward.id}>
                        {ward.full_name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </Box>
          </div>
        </div>

        <DialogContent
          sx={{
            padding: "0 !important",
            borderTop: theme.palette.border,
            borderBottom: theme.palette.border,
            height: `calc(100vh - ${theme.height.navbar} - 8rem)`,
            width: "100%",
          }}
        >
          {filteredPosts.length > 0 && <Table
            rows={filteredPosts}
            columns={postListColumns}
            showCheckbox={true}
            selectionModel={postIdsSelections}
            onSelectionModelChange={(newPostIdsSelections) => {
              setPostIdsSelection(newPostIdsSelections);
            }}
          />}
        </DialogContent>

        <DialogActions sx={{ padding: "20px 24px" }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button variant="outlined" size="small" onClick={handleOnSubmit}>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default memo(SelectThemePostsDialog);
