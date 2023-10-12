import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import { ToastContainer } from "react-toastify";
import { ThemeModeContext, useThemeMode } from "contexts/ThemeModeContext";
import { AppContextProvider } from "contexts/AppContext";
import { publicRoutes } from "routes";
import "react-toastify/dist/ReactToastify.css";
import "App.scss";

const App = () => {
  const { theme, handleThemeMode } = useThemeMode();

  return (
    <ThemeModeContext.Provider value={{ theme, handleThemeMode }}>
      <ThemeProvider theme={theme}>
        <AppContextProvider>
          {/* <Router> */}
          <Routes>
            {publicRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={
                  <>
                    <route.layout>
                      <route.component />
                    </route.layout>

                    {/* TOAST */}
                    <ToastContainer
                      position="bottom-right"
                      theme="colored"
                      autoClose={4000}
                      hideProgressBar={false}
                      closeOnClick
                    />
                  </>
                }
              />
            ))}
          </Routes>
          {/* </Router> */}
        </AppContextProvider>
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
};

export default App;
