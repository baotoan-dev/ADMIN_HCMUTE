import { Menu } from "@mui/material";
import { styled } from "@mui/material/styles";

const CssMenu = styled(Menu)(({ theme }) => ({
  "& .MuiMenu-list": {
    backgroundColor: theme.palette.background.main,
    boxShadow: theme.palette.boxShadow,
  },
  "& .MuiMenu-paper": {
    [theme.breakpoints.up("xs")]: {
      width: "100%",
    },
    [theme.breakpoints.up("md")]: {
      width: "inherit",
    },
  },
}));

const Popup = ({ anchorEl, open, onClose, children, id, MenuListProps }) => {
  return (
    <CssMenu
      id={id}
      MenuListProps={{ ...MenuListProps }}
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      transformOrigin={{
        horizontal: "right",
        vertical: "top",
      }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      style={{ marginTop: "18px" }}
    >
      {children}
    </CssMenu>
  );
};

export default Popup;
