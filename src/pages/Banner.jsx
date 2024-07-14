import { useState, useEffect, createContext } from "react";
import { toast } from "react-toastify";
import { axios } from "configs";
import {
  Button,
  Typography,
  Box,
  IconButton,
  Tooltip,
  Stack,
  Skeleton,
  Grid,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ConfirmDialog, AddBannerDialog, BannerList } from "components";
import { AddIcon } from "components/Icons";
import { usePermission } from "hooks";

export const BannerContext = createContext();

const Banner = () => {
  usePermission();
  const theme = useTheme();

  const [banners, setBanners] = useState([]);
  const [showAddBannerDialog, setShowAddBannerDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [checkRemoveBanner, setCheckRemoveBanners] = useState(false);

  // GET BANNERS
  useEffect(() => {
    const fetchBanners = async () => {
      const res = await axios.get("/v1/banners/all");
      if (res.success) {
        setBanners(res.data);
        setIsLoading(false);
      }
    };
    fetchBanners();
  }, [checkRemoveBanner]);
  
  const handleRemoveBanner = () => {
    setCheckRemoveBanners(!checkRemoveBanner);
  }

  // HANDLE CLICK SAVE BUTTON => SUBMIT
  const handleClickSaveBtn = async () => {
    // HIDE CONFIRM DIALOG
    setShowConfirmDialog(false);

    const data = {
      banners,
    };

    try {
      const res = await axios.put("v1/banners/status/many", data);
      if (res && res.success) {
        return toast.success("Upload banners status successfully");
      } else {
        return toast.error("Upload banners status failure");
      }
    } catch (error) {
      return toast.error("Upload banners status failure");
    }
  };

  return (
    <Box sx={{ padding: '10px'}}>
      <Typography variant="h2" color={theme.palette.color.main}>
        Cover List
      </Typography>

      <Tooltip title="Add new" disableInteractive>
        <IconButton
          variant="outlined"
          sx={{ marginTop: "2rem" }}
          onClick={() => setShowAddBannerDialog(true)}
        >
          <AddIcon />
        </IconButton>
      </Tooltip>
      {isLoading ? (
        <Stack spacing={1}>
          <Skeleton variant="text" sx={{ fontSize: "1rem" }} animation="wave" />

          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="rectangular" width={210} height={60} />
          <Skeleton variant="rounded" width={210} height={60} />
        </Stack>
      ) : (
        <>
          {/* MOBILE APP */}
          <Typography variant="h3" color={theme.palette.color.main} m="1rem 0">
            Mobile App
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} lg={6}>
              {/* ENABLED */}
              <Box
                sx={{
                  padding: "1rem",
                  border: theme.palette.border,
                }}
              >
                <Typography
                  mb="2rem"
                  variant="h4"
                  color={theme.palette.color.main}
                >
                  Enabled
                </Typography>
                <BannerList
                  banners={banners.filter(
                    (banner) => banner.status === 1 && banner.version === 1
                  )}
                  setBanners={setBanners}
                  handleRemoveBanner={handleRemoveBanner}
                />
              </Box>
            </Grid>
            <Grid item xs={12} lg={6}>
              {/* DISABLED */}
              <Box
                sx={{
                  padding: "1rem",
                  border: theme.palette.border,
                }}
              >
                <Typography
                  mb="2rem"
                  variant="h4"
                  color={theme.palette.color.main}
                >
                  Disabled
                </Typography>
                <BannerList
                  banners={banners.filter(
                    (banner) => banner.status === 0 && banner.version === 1
                  )}
                  setBanners={setBanners}
                  handleRemoveBanner={handleRemoveBanner}
                />
              </Box>
            </Grid>
          </Grid>

          <br />

          {/* Website */}
          <Typography variant="h3" color={theme.palette.color.main} m="1rem 0">
            Website
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} lg={6}>
              {/* ENABLED */}
              <Box
                sx={{
                  padding: "1rem",
                  border: theme.palette.border,
                }}
              >
                <Typography
                  mb="2rem"
                  variant="h4"
                  color={theme.palette.color.main}
                >
                  Enabled
                </Typography>
                <BannerList
                  banners={banners.filter(
                    (banner) => banner.status === 1 && banner.version === 2
                  )}
                  setBanners={setBanners}
                  handleRemoveBanner={handleRemoveBanner}
                />
              </Box>
            </Grid>
            <Grid item xs={12} lg={6}>
              {/* DISABLED */}
              <Box
                sx={{
                  padding: "1rem",
                  border: theme.palette.border,
                }}
              >
                <Typography
                  mb="2rem"
                  variant="h4"
                  color={theme.palette.color.main}
                >
                  Disabled
                </Typography>
                <BannerList
                  banners={banners.filter(
                    (banner) => banner.status === 0 && banner.version === 2
                  )}
                  setBanners={setBanners}
                  handleRemoveBanner={handleRemoveBanner}
                />
              </Box>
            </Grid>
          </Grid>
        </>
      )}

      <Button
        sx={{ marginTop: "2rem" }}
        variant="outlined"
        onClick={() => setShowConfirmDialog(true)}
      >
        Save
      </Button>

      {/* ADD BANNER DIALOG */}
      <AddBannerDialog
        open={showAddBannerDialog}
        setOpen={setShowAddBannerDialog}
        setBanners={setBanners}
      />

      {/* CONFIRM DIALOG */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onClickConfirm={handleClickSaveBtn}
        title="Update banners"
        text="Are you sure?"
      />
    </Box>
  );
};

export default Banner;
