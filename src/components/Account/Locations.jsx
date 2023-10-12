import { useContext, memo } from "react";
import { Box, Chip, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ListItem } from "components";
import { AccountContext } from "./UserDetail";

const AccountLocations = () => {
  const theme = useTheme();

  // GET CONTEXT VALUES
  const { locations } = useContext(AccountContext);

  return (
    <>
      <Box mt="2rem">
        {locations.length > 0 ? (
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
            {locations.map((item) => (
              <ListItem key={item.district_id}>
                <Chip label={`${item.district}, ${item.province}`} />
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

export default memo(AccountLocations);
