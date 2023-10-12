import {
  Grid,
  Box,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
  Checkbox,
  ListItemText,
  Chip,
} from "@mui/material";
import { useTheme, styled } from "@mui/material/styles";
import { TextField } from "components";

const Item = styled(Box)(({ theme }) => ({
  textarea: {
    fontSize: "1rem",
  },
}));

const CssSelect = styled(Select)(({ theme }) => ({
  backgroundColor: theme.palette.background.content,
  color: theme.palette.color.main,

  "& fieldset": {
    borderColor: theme.palette.color.border,
  },
  "&:hover > fieldset": {
    borderColor: theme.palette.color.border,
  },
  "&.Mui-focused fieldset": {
    borderColor: theme.palette.color.primary,
  },
  "& input": {
    color: theme.palette.color.main,
    fontSize: "1rem",
  },

  "& .MuiSelect-outlined": {
    // color: theme.palette.color.main,
    fontSize: "1rem",
  },
}));

const CssListItemText = styled(ListItemText)(({ theme }) => ({
  "& .MuiTypography-root": {
    fontSize: "1rem",
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const CreatePostCategories = ({
  parentCategories,
  childCategories,
  parentCategoryIdSelected,
  setParentCategoryIdSelected,
  categories,
  handleOnChangeChildCategory,
}) => {
  const theme = useTheme();

  // console.log("Just loaded the Categories component");

  return (
    <Grid container spacing={2}>
      {/* Parent category */}
      <Grid item xs={12} lg={6}>
        <Item>
          <TextField
            select
            label="Danh mục cha"
            value={parentCategoryIdSelected ? parentCategoryIdSelected : ""}
            onChange={(e) => setParentCategoryIdSelected(e.target.value)}
          >
            {parentCategories.map((parentCategory) => (
              <MenuItem key={parentCategory.id} value={parentCategory.id}>
                {parentCategory.name}
              </MenuItem>
            ))}
          </TextField>
        </Item>
      </Grid>

      {/* Child category */}
      <Grid item xs={12} lg={6}>
        <Item>
          <FormControl
            sx={{
              width: "100%",
            }}
          >
            <Box sx={{ position: "relative", backgroundColor: "blue" }}>
              <InputLabel
                // id="demo-multiple-checkbox-label"
                sx={{
                  color: theme.palette.color.main,
                  fontSize: "1rem",
                  backgroundColor: "transparent",
                  "& .Mui-focused": {
                    color: theme.palette.color.primary,
                    zIndex: 9998,
                  },
                }}
              >
                <Box
                  sx={{
                    paddingRight: "20px",
                    position: "relative",
                  }}
                >
                  Danh mục con
                  <Box
                    sx={{
                      paddingRight: "1.25rem",
                      bottom: 0,
                      left: 0,
                      width: "100%",
                      height: "calc(50% + 1.1px)",
                      backgroundColor: theme.palette.background.content,
                      position: "absolute",
                      zIndex: -1,
                    }}
                  ></Box>
                </Box>
              </InputLabel>
            </Box>
            <CssSelect
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              multiple
              value={categories.map((category) => category.child_id)}
              onChange={handleOnChangeChildCategory}
              input={<OutlinedInput label="Tag" />}
              renderValue={() => (
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                  }}
                >
                  {categories.map((category) => (
                    <Chip
                      key={category.child_id}
                      label={`${category.parent_name} (${category.child_name})`}
                    />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {childCategories.map((childCategory) => (
                <MenuItem key={childCategory.id} value={childCategory.id}>
                  <Checkbox
                    checked={categories
                      .map((category) => category.child_id)
                      .includes(childCategory.id)}
                    size="xsall"
                  />
                  <CssListItemText primary={childCategory.name} />
                </MenuItem>
              ))}
            </CssSelect>
          </FormControl>
        </Item>
      </Grid>
    </Grid>
  );
};

export default CreatePostCategories;
