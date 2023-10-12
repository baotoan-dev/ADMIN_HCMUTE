import { memo } from "react";
import { useState, useEffect } from "react";
import { Box, Button, Chip, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { SelectCategoryDialog, ListItem } from "components";
import { axios } from "configs";

const Categories = ({ categories, setCategories }) => {
  const theme = useTheme();

  const [showDialog, setShowDialog] = useState(false);
  const [allCategories, setAllCategories] = useState([]);

  // USE EFFECT
  useEffect(() => {
    // GET CATEGORIES
    const fetchAllCategories = async () => {
      const res = await axios.get("/v1/categories");
      if (res.success) {
        setAllCategories(res.data);
      }
    };
    fetchAllCategories();
  }, []);

  // HANDLE REMOVE CATEGORY
  const handleRemoveCategory = (categoryId) => {
    setCategories((prevState) =>
      prevState.filter((cate) => cate.child_category_id !== categoryId)
    );
  };

  return (
    <>
      <Button variant="outlined" onClick={() => setShowDialog(true)}>
        Thêm
      </Button>
      {categories.length > 0 ? (
        <Box mt="2rem">
          <Box
            component="ul"
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              flexWrap: "wrap",
              listStyle: "none",
              padding: 0,
              margin: "0 -1rem",
            }}
          >
            {categories.map((item) => (
              <ListItem key={item.child_category_id}>
                <Chip
                  label={`${item.parent_category} (${item.child_category})`}
                  onDelete={() => handleRemoveCategory(item.child_category_id)}
                />
              </ListItem>
            ))}
          </Box>
        </Box>
      ) : (
        <Typography color={theme.palette.color.main} mt="1rem">
          Empty
        </Typography>
      )}

      {/* SELECT CATEGORY DIALOG */}
      {allCategories
        ? allCategories.length > 0 && (
            <SelectCategoryDialog
              showDialog={showDialog}
              setShowDialog={setShowDialog}
              categories={categories}
              setCategories={setCategories}
              allCategories={allCategories}
            />
          )
        : null}
    </>
  );
};

export default memo(Categories);
