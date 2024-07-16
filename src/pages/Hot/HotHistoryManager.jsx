import { useState, useEffect } from "react";
import { Box, Stack } from "@mui/system";
import { Button, Skeleton, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { Table } from "components";
import { axios } from "configs";
import { usePermission } from "hooks";
import { API_CONSTANT_V3 } from "constant/urlServer";
import themeColumns from "configs/table/themeColumn";
import { FaHistory } from "react-icons/fa";

const HotHistoryManager = () => {
  usePermission();
  const theme = useTheme();
  const [themes, setThemes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchThemes = async () => {
    const res = await axios.get(
      `${API_CONSTANT_V3}/v3/theme-companies/by-admin/histories`
    );
    setThemes(res.data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchThemes();
  }, []);

  return (
    <Box sx={{
      height: fetchThemes ? "100vh" : "auto",
    }}>
      {isLoading ? (
        <Stack spacing={1}>
          {/* For variant="text", adjust the height via font-size */}
          <Skeleton variant="text" sx={{ fontSize: "1rem" }} animation="wave" />
          {/* For other variants, adjust the size with `width` and `height` */}
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="rectangular" width={210} height={60} />
          <Skeleton variant="rounded" width={210} height={60} />
        </Stack>
      ) : (
        <Box
          sx={{
            width: "100%",
            height: `calc(100vh - ${theme.height.navbar} - 6rem)`,
            paddingLeft: "10px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              marginBottom: "1rem",
            }}
          >
            <Typography
              variant="h2"
              sx={{
                color: theme.palette.color.main,
                paddingBottom: "1rem",
              }}
            >
              List of hot delete history
            </Typography>
            <Link to="/admin/hot-history">
              <Button variant="outlined">
                <FaHistory />
              </Button>
            </Link>
          </Box>

          <Table
            type="account"
            rows={themes}
            columns={themeColumns}
            showCheckbox={false}
          />
        </Box>
      )}
    </Box>
  );
};

export default HotHistoryManager;
