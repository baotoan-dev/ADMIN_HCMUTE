import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import { Box, Button } from "@mui/material";
import { toast } from "react-toastify";
import { useTheme } from "@mui/material/styles";
import styles from "./UserProfile.module.scss";
import avatar from "data/avatar2.jpg";
import { useEffect } from "react";
import { axios } from "configs";
import { useSelector, useDispatch } from "react-redux";
import { setProfile } from "../../redux/slice/profileSlice";
import { API_CONSTANT_V3 } from "constant/urlServer";

const cx = classNames.bind(styles);

const UserProfile = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const profiles = useSelector((state) => state.profile.profile);
  const dispatch = useDispatch();

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
              sessionStorage.setItem("userProfile", JSON.stringify(profileData));
            }
          } catch (error) {
            console.error("Error fetching user profile data:", error);
          }
        };

        fetchData();
      }
    }
  }, [profiles, dispatch]);

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

        // Clear session storage and localStorage
        sessionStorage.clear();
        localStorage.clear();

        // Navigate to sign-in page
        setTimeout(() => {
          navigate("/admin/auth");
        }, 1000);
      }
    } catch (error) {
      toast.error("Oops! An error occurred");
    }
  };

  console.log(profiles);

  return (
    <>
      {profiles && (
        <Box className={cx("wrapper")} sx={{ backgroundColor: theme.palette.background.main }}>
          <Box className={cx("info")} sx={{ borderBottom: theme.palette.border }}>
            <img src={profiles.avatarPath ? profiles.avatarPath : avatar} alt="" />
            <Box className={cx("content")} sx={{ color: theme.palette.color.main }}>
              <p className={cx("name")}>{profiles?.name}</p>
              <p className={cx("phone")}>{profiles?.phone}</p>
              <p className={cx("email")}>{profiles?.email}</p>
            </Box>
          </Box>

          <Box style={{
            width: "100%",
          }}>
            <Button variant="outlined" color="primary" style={{
              width: "100%",
            }} onClick={handleSignout}>
              Sign out
            </Button>
          </Box>
        </Box>
      )}
    </>
  );
};

export default UserProfile;
