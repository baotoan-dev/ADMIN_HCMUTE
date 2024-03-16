import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames/bind";
import { Box, Collapse, List, ListItemButton, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { useAppStateContext } from "contexts/AppContext";
import { superAdminTabs, normalAdminTabs } from "data/dummy";
import styles from "./Sidebar.module.scss";
import { Logo } from "components/Icons";

const cx = classNames.bind(styles);

const Sidebar = () => {
  const theme = useTheme();

  const [tabs, setTabs] = useState([]);
  const { sidebarRef, overlayRef } = useAppStateContext();
  const [navLinkActived, setNavLinkActived] = useState("home");
  const [selectedLink, setSelectedLink] = useState(null);

  // USE EFFECT TO CHECK SHOW SIDEBAR WHEN RESIZE SCREEN WIDTH
  useEffect(() => {
    if (localStorage.getItem("role") === "1") {
      setTabs(superAdminTabs);
    } else {
      setTabs(normalAdminTabs);
    }
    const resizeEventId = window.addEventListener("resize", () => {
      if (sidebarRef.current) {
        if (window.innerWidth >= 1200) {
          sidebarRef.current.style.left = 0;
          sidebarRef.current.style.opacity = 1;
        } else {
          sidebarRef.current.style.left = "-110%";
          sidebarRef.current.style.opacity = 0;
        }
      }

    });
    return () => window.removeEventListener("resize", resizeEventId);
  }, []);

  // HANDLE ON CLICK LINK ITEM
  const handleOnClickLink = (name) => {
    setSelectedLink(name === selectedLink ? null : name);
    setNavLinkActived(name);
    if (window.innerWidth < 1200) {
      sidebarRef.current.style.left = "-110%";
      sidebarRef.current.style.opacity = 0;
      overlayRef.current.style.display = "none";
    }
  };

  return (
    <Box
      ref={sidebarRef}
      sx={{
        backgroundColor: theme.palette.background.main,
        left: {
          xs: "-110%",
          lg: 0,
        },
        zIndex: {
          xs: 9999,
          lg: 999,
        },
      }}
      className={cx("wrapper")}
    >
      {/* LOGO */}
      <Box
        sx={{
          color: theme.palette.color.main,
          borderBottom: theme.palette.border,
        }}
        className={cx("header")}
      >
        <Box className={cx("logo")}>
          <Logo />

          <Box
            sx={{
              width: "1px",
              height: "32px",
              margin: "0 0.6rem",
              backgroundColor: theme.palette.color.border,
            }}
          />

          <Box>
            <Typography
              sx={{
                color: theme.palette.color.primary,
                fontSize: "16px",
                fontWeight: 500,
                lineHeight: 1.4,
              }}
            >
              JOBS
            </Typography>
            <Typography
              sx={{
                color: theme.palette.color.primary,
                fontSize: "10px",
                fontWeight: 500,
                lineHeight: 1.4,
                textAlign: "center",
              }}
            >
              HCMUTE
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box className={cx("links")}>
        {tabs && tabs.map((link) => (
          <Box className={cx("link-item")} key={link.title}>
            <Typography>{link.title}</Typography>
            {link.links.map((link) => (
              <>
                <ListItemButton
                  key={link.name}
                  sx={{
                    "&.Mui-selected": {
                      backgroundColor: theme.palette.background.active,
                    },
                  }}
                >
                  <Link
                    to={`${link.path}`}
                    key={link.name}
                    onClick={() => handleOnClickLink(link.name)}
                    style={{ width: "100%" }}
                  >
                    <Box
                      sx={[
                        {
                          color:
                            navLinkActived === link.name
                              ? theme.palette.color.active
                              : theme.palette.color.main,
                          backgroundColor:
                            navLinkActived === link.name
                              ? theme.palette.background.active
                              : theme.palette.background.main,
                        },
                        (theme) => ({
                          "&:hover": {
                            backgroundColor: theme.palette.background.hover,
                          },
                        }),
                        selectedLink === link.name && "fadeInAnimation" // áp dụng animation nếu là liên kết được chọn
                      ]}
                      className={cx("nav-link")}
                    >
                      {link.icon}
                      <span>{link.name}</span>
                    </Box>
                  </Link>
                </ListItemButton>
                {
                  link.subLinks && selectedLink === link.name && (
                    <Collapse in={true} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {link.subLinks.map((subLink) => (
                          <ListItemButton
                            key={subLink.name}
                            sx={{
                              "&.Mui-selected": {
                                backgroundColor: theme.palette.background.active,
                              },
                            }}
                            className={selectedLink === link.name && "fadeInAnimation"} 
                          >
                            <Link
                              to={`${subLink.path}`}
                              key={subLink.name}
                              onClick={() => handleOnClickLink(subLink.name)}
                              style={{ width: "100%" }}
                            >
                              <Box
                                sx={[
                                  {
                                    color:
                                      navLinkActived === subLink.name
                                        ? theme.palette.color.active
                                        : theme.palette.color.main,
                                    backgroundColor:
                                      navLinkActived === subLink.name
                                        ? theme.palette.background.active
                                        : theme.palette.background.main,
                                  },
                                  (theme) => ({
                                    "&:hover": {
                                      backgroundColor: theme.palette.background.hover,
                                    },
                                  }),
                                ]}
                                className={cx("nav-link")}
                              >
                                {subLink.icon}
                                <span>{subLink.name}</span>
                              </Box>
                            </Link>
                          </ListItemButton>
                        ))}
                      </List>
                    </Collapse>
                  )
                }
              </>
            ))}
          </Box>
        ))}
    </Box>
    </Box >
  );
};

export default Sidebar;
