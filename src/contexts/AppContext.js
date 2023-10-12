import { createContext, useState, useContext, useRef } from "react";

const AppContext = createContext();

const showPopupsStatus = {
  setting: false,
};

const AppContextProvider = ({ children }) => {
  const sidebarRef = useRef();
  const contentRef = useRef();
  const themeSettingRef = useRef();
  const overlayRef = useRef();

  const [showPopupStatus, setShowPopupStatus] = useState(showPopupsStatus);

  const contextValues = {
    showPopupStatus,
    setShowPopupStatus,
    sidebarRef,
    contentRef,
    themeSettingRef,
    overlayRef,
  };

  return (
    <AppContext.Provider value={contextValues}>{children}</AppContext.Provider>
  );
};

const useAppStateContext = () => useContext(AppContext);

export { AppContextProvider, useAppStateContext };
