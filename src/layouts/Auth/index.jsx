import { Box } from "@mui/material";

const AuthLayout = ({ children }) => {
  return (
    <Box
      sx={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        justifyContent: "center",
        backgroundColor: "#0a1929",
      }}
    >
      {children}
    </Box>
  );
};

export default AuthLayout;
