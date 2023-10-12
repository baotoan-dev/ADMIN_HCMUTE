import { Dialog } from "@mui/material";
import { styled } from "@mui/material/styles";

const CssDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    margin: 0,
    [theme.breakpoints.down("lg")]: {
      width: "calc(100vw - 2rem)",
      maxWidth: "calc(100vw - 2rem)",
    },
    [theme.breakpoints.up("lg")]: {
      width: "800px",
      maxWidth: "800px",
    },
    overflow: "hidden",
    backgroundColor: theme.palette.background.main,
    backgroundImage: "none",
  },
}));

export default CssDialog;
