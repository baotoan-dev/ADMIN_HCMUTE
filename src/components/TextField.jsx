import { TextField } from "@mui/material";
import { styled } from "@mui/material/styles";

const CssTextField = styled(TextField)(({ theme }) => ({
  width: "100%",
  "& label": {
    color: theme.palette.color.main,
    fontSize: "1rem",
    "& .Mui-focused": {
      color: theme.palette.color.primary,
    },
  },
  "& .MuiOutlinedInput-root": {
    backgroundColor: theme.palette.background.content,
    "& fieldset": {
      borderColor: theme.palette.color.border,
    },
    "&:hover fieldset": {
      borderColor: theme.palette.color.border,
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.color.primary,
    },
    "& input": {
      color: theme.palette.color.main,
      fontSize: "1rem",
    },
  },
  "& .MuiSelect-outlined": {
    color: theme.palette.color.main,
    fontSize: "1rem",
  },
  "& .MuiSvgIcon-root": {
    fontSize: "1.6rem",
    color: theme.palette.color.main,
  },
}));

export default CssTextField;
