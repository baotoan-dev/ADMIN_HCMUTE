import { memo } from "react";
import {
  Box,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  IconButton,
  useMediaQuery,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { CloseIcon } from "components/Icons";

const CustomImageList = ({ images, handleOnClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));


  return (
    <Box sx={{
      width: "100%",
    }}>
      {images.length > 0 ? (
        <Box mt={4} sx={{ color: "#eeeeee" }}>
          <ImageList
            variant="masonry"
            sx={{ width: "100%", height: 240 }}
            cols={isMobile ? 2 : 4}
            rowHeight={200}
            gap={16}
          >
            {images.map((image) => (
              <ImageListItem key={image.id}>
                <img src={image.image} alt="" loading="lazy" />
                <ImageListItemBar
                  sx={{ background: "transparent" }}
                  position="top"
                  key={image.id}
                  actionIcon={
                    <IconButton
                      sx={{
                        color: "#eeeeee",
                        background:
                          "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, " +
                          "rgba(0,0,0,0.3) 70%, rgba(0,0,0,0.4) 100%)",
                        margin: "8px 8px 0 0 ",
                      }}
                      onClick={() => handleOnClick(image)}
                    >
                      <CloseIcon />
                    </IconButton>
                  }
                  actionPosition="right"
                />
              </ImageListItem>
            ))}
          </ImageList>
        </Box>
      ) : (
        <Typography color={theme.palette.color.main}>Empty</Typography>
      )}
    </Box>
  );
};

export default memo(CustomImageList);
