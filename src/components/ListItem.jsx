import { styled } from "@mui/material/styles";

const ListItem = styled("li")(({ theme }) => ({
  margin: "0 0 1rem 0",
  padding: "0 1rem",
  "& .MuiChip-filled": {
    border: theme.palette.border,
    color: theme.palette.color.main,
    backgroundColor: theme.palette.background.content,
  },
  "& .MuiSvgIcon-root": {
    color: theme.palette.color.main,
  },
}));

export default ListItem;
