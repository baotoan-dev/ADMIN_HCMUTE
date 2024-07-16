import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Box, Typography, Stack, Skeleton, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { axios } from "configs";
import { serviceColumns } from "configs/table";
import { usePermission } from "hooks";
import TableCommunity from "components/Table/TableCommunity";
import { API_CONSTANT_V3 } from "constant/urlServer";
import { IoIosCreate } from "react-icons/io";
import { FaHistory } from "react-icons/fa";

// PAGE
const AdminServiceManagerPage = () => {
  usePermission();
  const theme = useTheme();
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getServicesData = async () => {
      let res = await axios.get(`${API_CONSTANT_V3}/v3/service-recruitment/by-admin`);

      if (res && res.status === 200) {
        setServices(res.data);
        setIsLoading(false);
      } else {
      }
    };
    getServicesData();
  }, []);

  const handleSearchFilterParent = (search) => {};

  return (
    <Box sx={{
      height: "100vh"
    }}>
      {isLoading ? (
        <Stack spacing={1}>
          <Skeleton variant="text" sx={{ fontSize: "1rem" }} animation="wave" />
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="rectangular" width={210} height={60} />
          <Skeleton variant="rounded" width={210} height={60} />
        </Stack>
      ) : (
        <>
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
                Service Manager
              </Typography>
              <Box sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
              }}>
                <Box
                  sx={{
                    marginRight: "10px",
                  }}
                >
                  {/* <Link to="/admin/service-history">
                    <Button variant="outlined">
                      <FaHistory />
                    </Button>
                  </Link> */}
                </Box>
                <Box>
                  <Link to="/admin/service-manager/create">
                    <Button variant="outlined">
                      <IoIosCreate />
                    </Button>
                  </Link>
                </Box>
              </Box>
            </Box>
            <TableCommunity
              type="service"
              handleSearchFilterParent={handleSearchFilterParent}
              rows={services}
              columns={serviceColumns}
              showCheckbox={false}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default AdminServiceManagerPage;
