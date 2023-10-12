import classNames from "classnames/bind";
import { useTheme } from "@mui/material/styles";
import {
  IconButton,
  Box,
  Typography,
  ButtonGroup,
  Button,
} from "@mui/material";

import { useAppStateContext } from "contexts/AppContext";
import { useThemeModeContext } from "contexts/ThemeModeContext";
import styles from "./ThemeSetting.module.scss";
import { SunIcon, MoonIcon, CloseIcon } from "components/Icons";

const cx = classNames.bind(styles);

const ThemeSetting = () => {
  const theme = useTheme();
  const { themeSettingRef, overlayRef, contentRef } = useAppStateContext();
  const { handleThemeMode } = useThemeModeContext();

  const handleCloseThemeSetting = () => {
    themeSettingRef.current.style.right = "-110%";
    themeSettingRef.current.style.opacity = 0;
    overlayRef.current.style.display = "none";
    contentRef.current.style.overflowY = "auto";
    contentRef.current.style.height = "auto";
  };

  return (
    <div
      ref={themeSettingRef}
      className={cx("wrapper", theme.palette.mode === "dark" ? "dark" : "")}
    >
      {/* HEADING */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem 0",
        }}
      >
        <Typography color={theme.palette.color.main} fontSize="1.125rem">
          SETTINGS
        </Typography>
        <IconButton
          onClick={handleCloseThemeSetting}
          sx={{
            color: theme.palette.color.main,
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* CHOOSE THEME MODE */}
      <section className={cx("themes")}>
        <Typography color={theme.palette.color.main} fontSize="1.125rem">
          MODE
        </Typography>

        <ButtonGroup size="medium" fullWidth aria-label="large button group">
          <Button
            variant="outlined"
            startIcon={<SunIcon />}
            onClick={() => handleThemeMode.changeThemeMode("light")}
          >
            Light
          </Button>
          <Button
            variant="outlined"
            startIcon={<MoonIcon />}
            onClick={() => handleThemeMode.changeThemeMode("dark")}
          >
            Dark
          </Button>
        </ButtonGroup>
      </section>
    </div>
  );
};

export default ThemeSetting;
