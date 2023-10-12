import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { useTheme, styled } from "@mui/material/styles";

const CssDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    minWidth: "360px",
    backgroundColor: theme.palette.background.main,
    backgroundImage: "none",
    margin: 0,
  },
}));

const ConfirmDialog = ({ isOpen, onClose, title, text, onClickConfirm }) => {
  const theme = useTheme();

  return (
    <CssDialog onClose={onClose} open={isOpen}>
      <DialogTitle
        onClose={onClose}
        variant="h4"
        sx={{
          color: theme.palette.color.main,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 24px",
        }}
      >
        {title}
      </DialogTitle>
      <DialogContent
        sx={{
          color: theme.palette.color.main,
          borderTop: theme.palette.border,
          borderBottom: theme.palette.border,
          padding: "20px 24px !important",
        }}
      >
        {text}
      </DialogContent>
      <DialogActions sx={{ padding: "20px 24px" }}>
        <Button variant="outlined" onClick={onClose} size="small">
          Hủy
        </Button>
        <Button variant="outlined" onClick={onClickConfirm} size="small">
          Đồng ý
        </Button>
      </DialogActions>
    </CssDialog>
  );
};

export default ConfirmDialog;
