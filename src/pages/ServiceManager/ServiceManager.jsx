import { useState, useEffect} from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Stack,
  Skeleton,
  Button,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { axios } from "configs";
import { serviceColumns } from "configs/table";
import { usePermission } from "hooks";
import TableCommunity from "components/Table/TableCommunity";

// PAGE
const AdminServiceManagerPage = () => {
  usePermission();
  const theme = useTheme();
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [updateLanguage, setUpdateLanguage] = useState(true);

  useEffect(() => {
    const getServicesData = async () => {
      let res = await axios.get(
        `http://localhost:1902/api/v3/service-recruitment`
      );

      if (res && res.status === 200) {
        setServices(res.data);
        setIsLoading(false);
      } else {
      }
    };
    getServicesData();
  }, [updateLanguage]);

  const handleSearchFilterParent = (search) => {};

  return (
    <>
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
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  color: theme.palette.color.main,
                  paddingBottom: "1rem",
                }}
              >
                Danh sách dịch vụ
              </Typography>

              <Box>
                <Link to="/admin/service-manager/create">
                  <Button variant="outlined">Tạo dịch vụ</Button>
                </Link>
              </Box>
            </Box>

            <TableCommunity
              handleSearchFilterParent={handleSearchFilterParent}
              rows={services}
              columns={serviceColumns}
              showCheckbox={false}
            />
          </Box>
        </>
      )}
    </>
  );
};

export default AdminServiceManagerPage;
