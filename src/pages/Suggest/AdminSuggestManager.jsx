import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button, Skeleton, Typography, Box, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { toast } from "react-toastify";
import imageCompression from "browser-image-compression";

import { axios } from "configs";
import { createPostValidation, validatePostImages } from "validations";
import { usePermission } from "hooks";
import { Table, LineChart } from "components";
import searchSuggestColumn from "configs/table/searchSuggestColumn";
import TableSuggestSearch from "components/Table/TableSuggestSearch";

const AdminSuggestManagerPage = () => {
  usePermission();

  const navigate = useNavigate();
  const theme = useTheme();
  const [checkData, setCheckData] = useState(false);
  const [suggests, setSuggests] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  const fetchSuggests = async () => {
    let res;

    res = await axios.get(`/v3/suggest-search`);
 
    setSuggests(res.data);

    if (res?.data?.length > 0){
      setCheckData(true);
    }
    setIsLoadingCategories(false);
  };


  useEffect(() => {
    fetchSuggests();
  }, [checkData]);


  const handleCheckData = () => {
    setCheckData(!checkData);
  }
  return (
    <>
      {isLoadingCategories ? (
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
            
          }}
        >
          <Box sx= {{
            display: "flex",
            justifyContent: 'space-between',
          }}>
            <Typography
              variant="h2"
              sx={{
              color: theme.palette.color.main,
              paddingBottom: "1rem",
              }}
            >
            Tất cả từ khoá
          </Typography>

          <Button
            sx={{ marginBottom: "1.5rem", justifyContent: 'flex-end' }}
            variant="outlined"
            onClick={() => {
              navigate(`/admin/create-search-suggest`);
            }}
          >
            Tạo từ khoá
          </Button>

          </Box>
          
          <TableSuggestSearch 
            handleCheckData={handleCheckData}
            rows={suggests} 
            columns={searchSuggestColumn} 
            showCheckbox={false} 
          />
        </Box>
      )}
    </>
  );
};

export default AdminSuggestManagerPage;
