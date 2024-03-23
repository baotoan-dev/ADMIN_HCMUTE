import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme, styled } from "@mui/material/styles";
import classNames from "classnames/bind";
import { Button, TextField, Box, Tabs, Tab } from "@mui/material";
import { toast } from "react-toastify";

import { axios } from "configs";
import styles from "./AuthForm.module.scss";
import { validateEmail } from "utils";

const cx = classNames.bind(styles);

const CssTextField = styled(TextField)(({ theme }) => ({
  "& label": {
    color: "#007fff",
    fontSize: "1rem",
    "&.Mui-focused": {
      color: "#007fff",
    },
  },
  "& .MuiOutlinedInput-root": {
    "&:hover > fieldset": {
      borderColor: "#007fff",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#007fff",
    },
    "& fieldset": {
      borderColor: "#007fff",
    },
    "& input": {
      color: "#eeeeee",
      fontSize: "1rem",
    },
  },
  "& .MuiSelect-outlined": {
    color: "#007fff",
  },
}));

const CssTabs = styled(Tabs)(({ theme }) => ({
  "& .MuiButtonBase-root": {
    color: theme.palette.color.primary,
    opacity: 1,
  },
  "& .MuiTabs-indicator": {
    backgroundColor: theme.palette.color.primary,
  },
}));

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ paddingTop: "2rem" }}>{children}</Box>}
    </div>
  );
};

const AuthForm = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [itemActived, setItemActived] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Handle sign up
  const handleSignUp = async () => {
    // Validate

    if (!email.toString().trim()) {
      return toast.warn("Email hoặc mật khẩu không hợp lệ");
    }
    if (!validateEmail(email.toString().trim())) {
      return toast.warn("Email không đúng định dạng");
    }

    const data = {
      email: email.toString().trim(),
      role: 2,
    };

    // Call API
    const url = "/v1/admin/signup";
    try {
      await axios.post(url, data);
      setItemActived(0);
      return toast.success("Đăng ký tài khoản thành công");
    } catch (error) {
      // Existed email error
      // Server error
      if (error.response && error.response.status === 409) {
        return toast.error("Email này đã được đăng ký");
      }
      return toast.error("Đăng ký tài khoản thất bại");
    }
  };

  // Handle sign in
  const handleSignIn = async () => {
    // Validate
    const data = {
      email: email.toString().trim(),
      password: password.toString().trim(),
    };
    if (!data.email || !data.password) {
      return toast.warn("Email hoặc mật khẩu không hợp lệ");
    }
    if (!validateEmail(data.email)) {
      return toast.warn("Email không đúng định dạng");
    }

    // Pass validation
    // Call API
    try {
      const res = await axios.post("/v1/sign-in/admin", data);

      sessionStorage.setItem("access-token", res.data.accessToken);
      localStorage.setItem("refresh-token", res.data.refreshToken);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("id", res.data.id);
      toast.success("Đăng nhập thành công");
      setTimeout(() => {
        return res.data.role === 1
          ? navigate("/admin")
          : navigate("/admin/posts/create");
      }, 1000);
    } catch (error) {
      return toast.error("Đăng nhập thất bại");
    }
  };

  // Handle sign in when press enter
  const handleSignInOnPressEnter = (e) => {
    if (e.keyCode === 13) {
      handleSignIn();
    }
  };

  // Handle sign up when press enter
  const handleSignUpOnPressEnter = (e) => {
    if (e.keyCode === 13) {
      handleSignUp();
    }
  };

  return (
    <Box className={cx("wrapper")}>
      {/* Actions */}
      <Box>
        <CssTabs
          sx={{ color: theme.palette.color.primary }}
          value={itemActived}
          onChange={(event, newValue) => setItemActived(newValue)}
          textColor="inherit"
          indicatorColor="primary"
          variant="fullWidth"
        >
          <Tab value={0} label="Sign In" color="primary" />
          <Tab value={1} label="Sign Up" color="primary" />
        </CssTabs>
      </Box>

      {/* TAB PANELS */}
      <TabPanel value={itemActived} index={0}>
        <Box>
          <Box>
            <CssTextField
              size="medium"
              type="text"
              label="Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => handleSignInOnPressEnter(e)}
              fullWidth
            />

            <CssTextField
              type="password"
              label="Password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => handleSignInOnPressEnter(e)}
              fullWidth
              sx={{ marginTop: "1.4rem" }}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "2rem",
            }}
          >
            <Button
              variant="outlined"
              onClick={handleSignIn}
              sx={{
                color: theme.palette.color.primary,
                border: `1px solid ${theme.palette.color.primary}`,
              }}
            >
              Sign In
            </Button>
          </Box>
        </Box>
      </TabPanel>

      {/*  */}
      <TabPanel value={itemActived} index={1}>
        <Box>
          <Box>
            <Box>
              <CssTextField
                type="text"
                label="Email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => handleSignUpOnPressEnter(e)}
                fullWidth
                // sx={{ marginTop: "1.4rem" }}
              />
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "2rem",
            }}
          >
            <Button
              variant="outlined"
              onClick={handleSignUp}
              size="medium"
              sx={{
                color: theme.palette.color.primary,
                border: `1px solid ${theme.palette.color.primary}`,
              }}
            >
              Sign Up
            </Button>
          </Box>
        </Box>
      </TabPanel>
    </Box>
  );
};

export default AuthForm;
