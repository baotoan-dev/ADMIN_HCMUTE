import { useState, useEffect } from "react";
import { Box, MenuItem, Button, Chip } from "@mui/material";
import { TextField, ListItem } from "components";
import { axios } from "configs";

const ThemeCategories = ({
  themeCategoriesOfPost,
  setThemeCategoriesOfPost,
}) => {
  const [visibleThemeCategories, setVisibleThemeCategories] = useState([]);
  const [themeCategoryIdSelected, setThemeCategoryIdSelected] = useState();

  useEffect(() => {
    // GET ALL THEME CATEGORIES
    const fetchThemeCategories = async () => {
      const res = await axios.get(`/v1/theme-categories`);
      if (res.success) {
        const visibleThemes = res.data.filter(
          (theme) =>
            themeCategoriesOfPost.findIndex(
              (currentTheme) => currentTheme.id === theme.id
            ) < 0
        );

        setVisibleThemeCategories(visibleThemes);
        if (visibleThemes.length > 0) {
          setThemeCategoryIdSelected(visibleThemes[0].id);
        }
      }
    };
    fetchThemeCategories();
  }, []);

  // HANDLE ADD THEME CATEGORY
  const handleAddThemeCategory = () => {
    // ADD THEME TO THEME CATEGORIES OF POST
    const theme = visibleThemeCategories.find(
      (theme) => theme.id === themeCategoryIdSelected
    );
    setThemeCategoriesOfPost((prevState) => [theme, ...prevState]);

    // REMOVE FROM VISIBLE THEME CATEGORIES
    const visibleThemes = visibleThemeCategories.filter(
      (theme) => theme.id !== themeCategoryIdSelected
    );
    setVisibleThemeCategories(visibleThemes);

    // RESET themeCategoryIdSelected
    setThemeCategoryIdSelected(
      visibleThemes.length > 0 ? visibleThemes[0].id : null
    );
  };

  // HANDLE REMOVE THEME CATEGORY
  const handleRemoveThemeCategory = (themeCategoryId) => {
    // ADD THEME TO VISIBLE THEME CATEGORIES
    const theme = themeCategoriesOfPost.find(
      (theme) => theme.id === themeCategoryId
    );
    setVisibleThemeCategories((prevState) => [...prevState, theme]);

    // REMOVE FROM THEME CATEGORIES OF POST
    setThemeCategoriesOfPost((prevState) =>
      prevState.filter((theme) => theme.id !== themeCategoryId)
    );
  };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <TextField
          sx={{ width: "400px" }}
          select
          label="Select theme category"
          value={themeCategoryIdSelected ? themeCategoryIdSelected : ""}
          onChange={(e) => setThemeCategoryIdSelected(e.target.value)}
        >
          {visibleThemeCategories.map((themeCategory) => (
            <MenuItem key={themeCategory.id} value={themeCategory.id}>
              {themeCategory.name}
            </MenuItem>
          ))}
        </TextField>
        <Button
          variant="outlined"
          sx={{ marginLeft: "2rem" }}
          onClick={handleAddThemeCategory}
        >
          Add
        </Button>
      </Box>

      {/* LIST */}
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
          {themeCategoriesOfPost.map((themeCategory) => (
            <ListItem key={themeCategory.id}>
              <Chip
                label={themeCategory.name}
                onDelete={() => handleRemoveThemeCategory(themeCategory.id)}
              />
            </ListItem>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default ThemeCategories;
