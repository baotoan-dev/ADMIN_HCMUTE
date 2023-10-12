import { useState } from "react";
import {
  FormControl,
  DialogContent,
  DialogTitle,
  MenuItem,
  DialogActions,
  Button,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { TextField, Dialog } from "components";
import { useEffect } from "react";

const SelectCategoryDialog = ({
  showDialog,
  setShowDialog,
  categories,
  setCategories,
  allCategories,
}) => {
  const theme = useTheme();

  const [parentCategories] = useState(
    allCategories.map((category) => ({
      id: category.parent_category_id,
      name: category.parent_category,
    }))
  );
  const [parentCategoryIdSelected, setParentCategoryIdSelected] =
    useState(null);
  const [childCategories, setChildCategories] = useState([]);
  const [childCategoryIdSelected, setChildCategoryIdSelected] = useState(null);

  // Set child categories when change parent category
  useEffect(() => {
    if (parentCategoryIdSelected) {
      const currentChildCategoryIds = categories.map(
        (category) => category.child_category_id
      );

      const childs = allCategories
        .find(
          (category) => category.parent_category_id === parentCategoryIdSelected
        )
        .childs.filter((cate) => !currentChildCategoryIds.includes(cate.id));

      setChildCategories(childs);
      setChildCategoryIdSelected(childs.length > 0 ? childs[0].id : "");
    }
  }, [parentCategoryIdSelected, categories.length]);

  // HANDLE ADD NEW CATEGORY
  const handleAddNewCategory = () => {
    if (parentCategoryIdSelected && childCategoryIdSelected) {
      // CLOSE MODAL
      setShowDialog(false);

      setCategories((prevState) => [
        ...prevState,
        {
          child_category_id: childCategoryIdSelected,
          child_category: childCategories.find(
            (childCategory) => childCategory.id === childCategoryIdSelected
          ).name,
          parent_category_id: parentCategoryIdSelected,
          parent_category: parentCategories.find(
            (parentCategories) =>
              parentCategories.id === parentCategoryIdSelected
          ).name,
        },
      ]);
    }
  };

  return (
    <>
      <Dialog
        disableEscapeKeyDown
        open={showDialog}
        onClose={() => setShowDialog(false)}
      >
        <DialogTitle
          color={theme.palette.color.main}
          variant="h4"
          sx={{ padding: "20px 24px" }}
        >
          Thêm danh mục ngành nghề
        </DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexWrap: "wrap",
            padding: "20px 24px 0px 24px !important",
            margin: "0 -1rem !important",
            borderTop: theme.palette.border,
            borderBottom: theme.palette.border,
          }}
        >
          {/* PARENT CATEGORY */}
          <FormControl
            sx={{
              width: {
                xs: "100%",
                lg: "50%",
              },
              padding: "0 1rem",
              marginBottom: "1rem",
            }}
          >
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
          </FormControl>

          {/* CHILD CATEGORY */}
          <FormControl
            sx={{
              width: {
                xs: "100%",
                lg: "50%",
              },
              padding: "0 1rem",
              marginBottom: "1rem",
            }}
          >
            <TextField
              select
              label="Danh mục con"
              value={childCategoryIdSelected ? childCategoryIdSelected : ""}
              onChange={(e) => setChildCategoryIdSelected(e.target.value)}
            >
              {childCategories.map((cate) => (
                <MenuItem key={cate.id} value={cate.id}>
                  {cate.name}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ padding: "20px 24px" }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setShowDialog(false)}
          >
            Cancel
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={handleAddNewCategory}
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SelectCategoryDialog;
