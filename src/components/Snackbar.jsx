import { Snackbar, Slide, Alert } from "@mui/material";

const SlideTransition = (props) => {
  return <Slide {...props} direction="right" />;
};

const CustomSnackbar = ({ open, onClose, severity, message }) => (
  <Snackbar
    open={open}
    autoHideDuration={4000}
    onClose={onClose}
    TransitionComponent={SlideTransition}
  > 
    <Alert
      variant="filled"
      severity={severity}
      onClose={onClose}
      sx={{ color: "#eee", fontSize: "1rem" }}
    >
      {message}
    </Alert>
  </Snackbar>
);

export default CustomSnackbar;
