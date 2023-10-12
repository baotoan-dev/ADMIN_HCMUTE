import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { Sidebar, ThemeSetting, Navbar } from "components";
import { useAppStateContext } from "contexts/AppContext";

const MainLayout = ({ children }) => {
  const theme = useTheme();
  const { contentRef, overlayRef, themeSettingRef, sidebarRef } =
    useAppStateContext();

  // HANDLE ON CLICK OVERLAY
  const handleOnClickOverlay = () => {
    // RESET THEME SETTINGS STYLES
    themeSettingRef.current.style.right = "-24rem";
    themeSettingRef.current.style.opacity = 0;
    overlayRef.current.style.display = "none";

    // RESET SIDEBAR STYLES
    if (window.innerWidth < 1200) {
      sidebarRef.current.style.left = "-110%";
      sidebarRef.current.style.opacity = 0;
    }
  };

  return (
    <Box>
      <Box>
        {/* SIDEBAR */}
        {localStorage.getItem("role") && <Sidebar />}

        {/* CONTENT */}
        <Box
          ref={contentRef}
          sx={{
            backgroundColor: theme.palette.background.main,
            minHeight: "100vh",
            width: "100%",
            padding:
              localStorage.getItem("role")
                ? {
                    xs: `calc(${theme.height.navbar} + 1rem) 1rem 1rem 0`,
                    lg: `calc(${theme.height.navbar} + 1rem) 1rem 1rem calc(${theme.width.sidebar})`,
                  }
                : `calc(${theme.height.navbar} + 1rem) 1rem 1rem 1rem`,
            transition: "all ease-in-out 0.3s",
          }}
        >
          {/* NAVBAR */}
          <Navbar />

          {/* CONTENT */}
          <Box>{children}</Box>
        </Box>
      </Box>

      {/* THEME SETTINGS */}
      <ThemeSetting />

      {/* OVERLAY */}
      <Box
        ref={overlayRef}
        sx={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          zIndex: 999,
          display: "none",
        }}
        onClick={handleOnClickOverlay}
      />
    </Box>
  );
};

export default MainLayout;
