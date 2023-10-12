import { useContext, memo } from "react";
import { Box, Chip, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ListItem } from "components";
import { AccountContext } from "./UserDetail";

const Categories = () => {
  const theme = useTheme();

  // GET CONTEXT VALUES
  const { categories } = useContext(AccountContext);

  return (
    <>
      {/* CATEGORIES LIST */}
      <Box mt="2rem">
        {categories.length > 0 ? (
          <Box
            component="ul"
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              flexWrap: "wrap",
              listStyle: "none",
              p: 0,
              m: "0 -1rem",
            }}
          >
            {categories.map((item) => (
              <ListItem key={item.child_category_id}>
                <Chip
                  label={`${item.parent_category} (${item.child_category})`}
                />
              </ListItem>
            ))}
          </Box>
        ) : (
          <Typography color={theme.palette.color.main}>Empty</Typography>
        )}
      </Box>
    </>
  );
};

export default memo(Categories);
