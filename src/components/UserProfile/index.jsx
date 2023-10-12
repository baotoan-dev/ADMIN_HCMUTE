import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import { Box, Button } from "@mui/material";
import { toast } from "react-toastify";
import { useTheme } from "@mui/material/styles";

import { axios } from "configs";
import styles from "./UserProfile.module.scss";
import avatar from "data/avatar2.jpg";
import { userProfileData } from "data/dummy";

const cx = classNames.bind(styles);

const UserProfile = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  // Handle sign out
  const handleSignout = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh-token");
      if (refreshToken) {
        const data = {
          refreshToken,
        };
        const url = "v1/admin/sign-out";
        await axios.post(url, data);
        toast.success("Nice! Sign out successfully");

        // Clear sessiong storage
        sessionStorage.clear();
        localStorage.clear();

        // Navigate to sign in page
        setTimeout(() => {
          return navigate("/admin/auth");
        }, 1000);
      }
    } catch (error) {
      return toast.error("Oops! An error occurred");
    }
  };

  return (
    <Box
      className={cx("wrapper")}
      sx={{ backgroundColor: theme.palette.background.main }}
    >
      <Box
        className={cx("info")}
        sx={{
          borderBottom: theme.palette.border,
        }}
      >
        <img src={avatar} alt="" />
        <Box
          className={cx("content")}
          sx={{
            color: theme.palette.color.main,
          }}
        >
          <p className={cx("name")}>Michael Roberts</p>
          <p className={cx("role")}>Administrator</p>
          <p className={cx("email")}>info@shop.com</p>
        </Box>
      </Box>

      {userProfileData.map((section) => (
        <section
          key={section.title}
          sx={{ borderBottom: theme.palette.border }}
        >
          <span
            className={cx("icon")}
            style={{
              color: section.iconColor,
              backgroundColor: section.iconBg,
            }}
          >
            {section.icon}
          </span>
          <Box
            className={cx("content")}
            sx={{
              color: theme.palette.color.main,
            }}
          >
            <p className={cx("title")}>{section.title}</p>
            <p className={cx("sub-title")}>{section.desc}</p>
          </Box>
        </section>
      ))}

      <Box>
        <Button
          variant="outlined"
          color="primary"
          fullWidth
          onClick={handleSignout}
        >
          Sign out
        </Button>
      </Box>
    </Box>
  );
};

export default UserProfile;
