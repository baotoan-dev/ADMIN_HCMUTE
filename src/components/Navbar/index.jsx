import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import { Tooltip, Button, IconButton, Avatar, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import styles from "./Navbar.module.scss";
import { Notification, UserProfile, Popup } from "components";
import { useAppStateContext } from "contexts/AppContext";
import {
  BellIcon,
  ArrowDownIcon,
  SettingIcon,
  MenuIcon,
} from "components/Icons";
import avatar from "data/avatar2.jpg";
import { useSelector, useDispatch } from "react-redux";
import { setProfile } from "../../redux/slice/profileSlice";
import { axios } from "configs";
import { API_CONSTANT_V3 } from "constant/urlServer";

const cx = classNames.bind(styles);

const CustomIconButton = ({ theme, children }) => (
  <IconButton sx={{ color: theme.palette.color.primary }}>
    {children}
  </IconButton>
);

const Navbar = () => {
  const theme = useTheme();
  const profiles = useSelector((state) => state.profile.profile);
  const dispatch = useDispatch();
  const { sidebarRef, themeSettingRef, overlayRef } = useAppStateContext();
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const openNotification = Boolean(notificationAnchorEl);
  const openProfile = Boolean(profileAnchorEl);

  useEffect(() => {
    // Kiểm tra xem profiles đã có dữ liệu hay chưa
    if (!profiles || !profiles.name) {
      // Kiểm tra xem có dữ liệu trong localStorage hay không
      const storedProfileData = sessionStorage.getItem("userProfile");
      if (storedProfileData) {
        const profileData = JSON.parse(storedProfileData);
        dispatch(setProfile(profileData));
      } else {
        // Fetch access token from the session
        const accessToken = sessionStorage.getItem("access-token");

        const fetchData = async () => {
          const url = `${API_CONSTANT_V3}/v3/profiles/me`;
          try {
            const res = await axios.get(url, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });
            if (res && res.status === 200) {
              const profileData = res.data;
              dispatch(setProfile(profileData));
              // Lưu dữ liệu vào localStorage
              sessionStorage.setItem(
                "userProfile",
                JSON.stringify(profileData)
              );
            }
          } catch (error) {
            console.error("Error fetching user profile data:", error);
          }
        };

        fetchData();
      }
    }
  }, [profiles, dispatch]);

  const handleClickNotification = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleClickProfile = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleCloseNotification = () => {
    setNotificationAnchorEl(null);
  };
  const handleCloseProfile = () => {
    setProfileAnchorEl(null);
  };

  const handleOpenSidebar = () => {
    if (sidebarRef.current && overlayRef.current) {
      sidebarRef.current.style.left = 0;
      sidebarRef.current.style.opacity = 1;
      overlayRef.current.style.display = "block";
    }
  };

  const handleOpenThemeSetting = () => {
    themeSettingRef.current.style.right = 0;
    themeSettingRef.current.style.opacity = 1;
    overlayRef.current.style.display = "block";
  };

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.main,
        borderBottom: theme.palette.border,
        height: theme.height.navbar,
      }}
      className={cx("wrapper")}
    >
      {/* Menu icon */}
      {localStorage.getItem("role") && (
        <Box>
          <Tooltip title="Menu">
            <Box onClick={handleOpenSidebar}>
              <CustomIconButton theme={theme}>
                <MenuIcon />
              </CustomIconButton>
            </Box>
          </Tooltip>
        </Box>
      )}

      {/* Right icons */}
      <Box className={cx("right-icons")}>
        {/* Notification */}
        {profiles && profiles.roleData === 1 && (
          <Tooltip title="Notification">
            <Box
              id="notification-button"
              onClick={handleClickNotification}
              aria-controls={openNotification ? "notification-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={openNotification ? "true" : undefined}
            >
              <CustomIconButton theme={theme}>
                <BellIcon />
              </CustomIconButton>
            </Box>
          </Tooltip>
        )}

        {/* Notification */}
        {/* Setting */}
        <Tooltip title="Setting">
          <Box onClick={handleOpenThemeSetting}>
            <CustomIconButton theme={theme}>
              <SettingIcon />
            </CustomIconButton>
          </Box>
        </Tooltip>

        {/* Profile */}
        <Tooltip title="Profile">
          <Box
            id="profile-button"
            onClick={handleClickProfile}
            aria-controls={openProfile ? "profile-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={openProfile ? "true" : undefined}
          >
            <Button
              endIcon={<ArrowDownIcon />}
              size="small"
              sx={{ color: theme.palette.color.primary }}
            >
              <Avatar
                alt="Avatar"
                src={avatar}
                sx={{ width: 32, height: 32 }}
              />
            </Button>
          </Box>
        </Tooltip>

        {/* Menu */}
        {/* Notification */}
        <Popup
          anchorEl={notificationAnchorEl}
          open={openNotification}
          onClose={handleCloseNotification}
          id="notification-menu"
          MenuListProps={{
            "aria-labelledby": "notification-button",
          }}
        >
          <Notification handleCloseNotification={handleCloseNotification} />
        </Popup>

        {/* Profile */}
        <Popup
          anchorEl={profileAnchorEl}
          open={openProfile}
          onClose={handleCloseProfile}
          id="profile-menu"
          MenuListProps={{
            "aria-labelledby": "profile-button",
          }}
        >
          <UserProfile />
        </Popup>
      </Box>
    </Box>
  );
};

export default Navbar;
