import { useState, useMemo, createContext, useContext } from "react";
import { createTheme } from "@mui/material/styles";

export const themeSettings = (mode) => {
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            // PALETTE VALUES FOR DARK MODE
            color: {
              main: "#eeeeee",
              primary: "#007fff",
              success: "#2e7d32",
              warning: "#ff8f00",
              error: "#c62828",
              active: "#0072e5",
              border: "#001e3c",
            },
            background: {
              main: "#0a1929",
              navbar: "rgba(10, 25, 41, 0.8)",
              content: "#001e3c",
              active: "#001e3c",
              hover: "rgba(19, 47, 76, 0.4)",
            },
            border: "0.063rem solid #001e3c",
            boxShadow:
              "0px 5px 5px -3px rgb(0 0 0 / 20%), 0px 8px 10px 1px rgb(0 0 0 / 14%), 0px 3px 14px 2px rgb(0 0 0 / 12%)",
          }
        : {
            // PALETTE VALUES FOR LIGHT MODE
            color: {
              main: "#212121",
              primary: "#007fff",
              success: "#2e7d32",
              warning: "#ff8f00",
              error: "#c62828",
              active: "#0072e5",
              border: "#eeeeee",
            },
            background: {
              main: "#ffffff",
              navbar: "rgba(255, 255, 255, 0.8)",
              content: "#f0f7ff",
              active: "#f0f7ff",
              hover: "#f1f1f1",
            },
            border: "0.063rem solid #eeeeee",
            boxShadow:
              "0px 5px 5px -3px rgb(0 0 0 / 20%), 0px 8px 10px 1px rgb(0 0 0 / 14%), 0px 3px 14px 2px rgb(0 0 0 / 12%)",
          }),
    },
    fontFamily: ["ProximaNova", "sans-serif"].join(","),
    width: {
      sidebar: "16rem",
      themeSettings: "24rem",
    },
    height: {
      navbar: "4rem",
    },
    typography: {
      fontFamily: ["ProximaNova", "sans-serif"].join(","),
      fontSize: 16,
      h1: {
        fontFamily: ["ProximaNova", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["ProximaNova", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["ProximaNova", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["ProximaNova", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["ProximaNova", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["ProximaNova", "sans-serif"].join(","),
        fontSize: 14,
      },
    },
  };
};

// CONTEXT FOR THEME MODE
export const ThemeModeContext = createContext();

export const useThemeModeContext = () => useContext(ThemeModeContext);

export const useThemeMode = () => {
  const [themeMode, setThemeMode] = useState(
    localStorage.getItem("theme-mode") || "dark"
  );

  const handleThemeMode = useMemo(
    () => ({
      toggleThemeMode: () =>
        setThemeMode((prevState) => (prevState === "light" ? "dark" : "light")),
      changeThemeMode: (mode) => {
        localStorage.setItem("theme-mode", mode);
        return setThemeMode(mode);
      },
    }),
    []
  );
  const theme = useMemo(
    () => createTheme(themeSettings(themeMode)),
    [themeMode]
  );
  return { theme, handleThemeMode };
};
