import { Box } from "@mui/material";

const Overlay = ({ onClick }) => {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        zIndex: 999,
        // display: "none",
      }}
      onClick={onClick}
    />
  );
};

export default Overlay;
