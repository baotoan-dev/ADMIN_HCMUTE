// import classNames from "classnames/bind";
import { Link } from "react-router-dom";
import { Button, Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

// import styles from "./Card.module.scss";

// const cx = classNames.bind(styles);

const Card = ({ data = {} }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.main,
        border: theme.palette.border,
        boxShadow: theme.palette.boxShadow,
        padding: "20px 32px",
        borderRadius: "6px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            flex: 1,
            fontSize: "20px",
            color: theme.palette.color.main,
          }}
        >
          {data.title}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "1rem",
        }}
      >
        <Typography
          sx={{
            color: theme.palette.color.main,
            fontSize: "32px",
            marginRight: "1rem",
          }}
        >
          {data.quantity}
        </Typography>

        <Button variant="outlined" size="small">
          <Link to={data.link}>View</Link>
        </Button>
      </Box>
    </Box>
  );
};

export default Card;
