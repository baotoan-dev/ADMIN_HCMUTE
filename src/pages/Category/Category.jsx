import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Skeleton, Typography, Box, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { axios } from "configs";
import { usePermission } from "hooks";
import categoryColumns from "configs/table/categoryColumns";
import TableCategoryParent from "components/Table/TableCategoryParent";

const CategoryPage = () => {
  usePermission();

  const navigate = useNavigate();
  const theme = useTheme();
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [checkRefresh, setCheckRefresh] = useState(false);

  const fetchCategories = async () => {
    let res;

    res = await axios.get(`http://localhost:1902/api/v3/parent`);
 
    setCategories(res.data);

    setIsLoadingCategories(false);
  };


  useEffect(() => {
    fetchCategories();
  }, [checkRefresh]);

  const handleCheck = () => {
    setCheckRefresh(!checkRefresh);
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
            paddingLeft: "10px"
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
            Tất cả danh mục cha
          </Typography>

          <Button
            sx={{ marginBottom: "1.5rem", justifyContent: 'flex-end' }}
            variant="outlined"
            onClick={() => {
              navigate(`/admin/create-parent-category`);
            }}
          >
            Tạo danh mục
          </Button>

          </Box>
          
          <TableCategoryParent 
            handleCheck={handleCheck}
            rows={categories} 
            columns={categoryColumns} 
            showCheckbox={false} 
          />
        </Box>
      )}
    </>
  );
};

export default CategoryPage;
