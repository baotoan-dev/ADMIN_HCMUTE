import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Box,
  Button,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Stack,
  Skeleton,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { axios } from "configs";
import { AddThemeDialog, ConfirmDialog, EditThemeDialog } from "components";
import { EditIcon, DeleteIcon } from "components/Icons";
import { usePermission } from "hooks";

const ThemePage = () => {
  usePermission();
  const theme = useTheme();
  const navigate = useNavigate();

  const [enabledThemes, setEnabledThemes] = useState([]);
  const [disabledThemes, setDisabledThemes] = useState([]);
  const [showAddThemeDialog, setShowAddThemeDialog] = useState(false);
  const [showEditThemeDialog, setShowEditThemeDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [themeEdited, setThemeEdited] = useState(null);

  // GET THEMES
  useEffect(() => {
    const fetchThemes = async () => {
      const res = await axios.get("/v1/themes/all");
      if (res.success) {
        setEnabledThemes(res.data.filter((theme) => theme.status === 1));
        setDisabledThemes(res.data.filter((theme) => theme.status === 0));
      }
    };

    fetchThemes();
  }, []);

  // HANDLE DISABLE THEME
  const handleDisableTheme = useCallback((theme) => {
    setEnabledThemes((prevState) =>
      prevState.filter((currenttheme) => currenttheme.id !== theme.id)
    );
    setDisabledThemes((prevState) => [
      {
        ...theme,
        status: 0,
      },
      ...prevState,
    ]);
  }, []);

  // HANDLE ENABLE THEME
  const handleEnableTheme = useCallback((theme) => {
    setDisabledThemes((prevState) =>
      prevState.filter((currentTheme) => currentTheme.id !== theme.id)
    );
    setEnabledThemes((prevState) => [
      {
        ...theme,
        status: 1,
      },
      ...prevState,
    ]);
  }, []);

  // HANDLE CLICK EDIT BUTTON
  const handleOnClickEditButton = (theme) => {
    setThemeEdited(theme);
    setShowEditThemeDialog(true);
  };

  // HANDLE CLICK SAVE BUTTON => SUBMIT TO CHANGE THEMES STATUS
  const handleClickSaveBtn = async () => {
    // HIDE CONFIRM DIALOG
    setShowConfirmDialog(false);

    const data = {
      themes: [
        ...enabledThemes.map((theme) => ({
          id: theme.id,
          status: 1,
        })),
        ...disabledThemes.map((theme) => ({
          id: theme.id,
          status: 0,
        })),
      ],
    };

    try {
      const res = await axios.put("/v1/themes/status", data);
      if (res.success) {
        return toast.success("Upload themes status successfully");
      }
    } catch (error) {
      return toast.error("Upload themes status failure");
    }
  };

  return (
    <Box sx={{ color: theme.palette.color.main, padding: '10px' }}>
      <Typography variant="h2">List of topics</Typography>
      <Button
        variant="outlined"
        sx={{ margin: "1rem 0" }}
        onClick={() => setShowAddThemeDialog(true)}
      >
        Add new
      </Button>

      {/* ENABLED THEMES */}
      <Typography variant="h3" sx={{ padding: "1rem 0" }}>
        Enabled themes
      </Typography>
      {enabledThemes.length > 0 ? (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            margin: "0 -1rem ",
          }}
        >
          {enabledThemes.map((enabledTheme) => (
            <Box
              key={enabledTheme.id}
              sx={{
                width: "25%",
                backgroundColor: theme.palette.background.main,
                marginBottom: "1rem",
                padding: "0 1rem",
              }}
            >
              <Card
                sx={{
                  width: "100%",
                  padding: "1rem",
                  backgroundColor: theme.palette.background.main,
                }}
              >
                <CardMedia
                  component="img"
                  alt="green iguana"
                  sx={{
                    width: "100%",
                    borderRadius: "4px",
                    height: "200px",
                    cursor: "pointer",
                  }}
                  image={enabledTheme.image}
                  onClick={() =>
                    navigate(`/admin/posts?themeId=${enabledTheme.id}`)
                  }
                />
                <CardContent sx={{ padding: "1rem 0" }}>
                  <Typography
                    variant="h5"
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    {enabledTheme.title}
                  </Typography>
                </CardContent>
                <CardActions
                  sx={{
                    padding: "0",
                    justifyContent: "center",
                  }}
                >
                  <IconButton
                    onClick={() => handleOnClickEditButton(enabledTheme)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDisableTheme(enabledTheme)}>
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Box>
          ))}
        </Box>
      ) : (
        <Stack spacing={1}>
          {/* For variant="text", adjust the height via font-size */}
          <Skeleton variant="text" sx={{ fontSize: "1rem" }} animation="wave" />
          {/* For other variants, adjust the size with `width` and `height` */}
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="rectangular" width={210} height={60} />
          <Skeleton variant="rounded" width={210} height={60} />
        </Stack>
      )}

      {/* DISABLED THEMES  */}
      <Typography variant="h3" sx={{ padding: "1rem 0" }}>
        Disabled themes
      </Typography>
      {disabledThemes.length > 0 ? (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            margin: "0 -1rem ",
          }}
        >
          {disabledThemes.map((disabledTheme) => (
            <Box
              key={disabledTheme.id}
              sx={{
                width: "25%",
                backgroundColor: theme.palette.background.main,
                marginBottom: "1rem",
                padding: "0 1rem",
              }}
            >
              <Card
                sx={{
                  width: "100%",
                  padding: "1rem",
                  backgroundColor: theme.palette.background.main,
                }}
              >
                <CardMedia
                  component="img"
                  alt="green iguana"
                  sx={{
                    width: "100%",
                    height: "200px",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                  image={disabledTheme.image}
                  onClick={() =>
                    navigate(`/admin/posts?themeId=${disabledTheme.id}`)
                  }
                />
                <CardContent sx={{ padding: "1rem 0" }}>
                  <Typography
                    variant="h5"
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    {disabledTheme.title}
                  </Typography>
                </CardContent>
                <CardActions
                  sx={{
                    padding: "0",
                    justifyContent: "center",
                  }}
                >
                  <IconButton
                    onClick={() => handleOnClickEditButton(disabledTheme)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleEnableTheme(disabledTheme)}>
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Box>
          ))}
        </Box>
      ) : (
        <Stack spacing={1}>
          {/* For variant="text", adjust the height via font-size */}
          <Skeleton variant="text" sx={{ fontSize: "1rem" }} animation="wave" />
          {/* For other variants, adjust the size with `width` and `height` */}
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="rectangular" width={210} height={60} />
          <Skeleton variant="rounded" width={210} height={60} />
        </Stack>
      )}

      <Button
        sx={{ marginTop: "2rem" }}
        variant="outlined"
        onClick={() => setShowConfirmDialog(true)}
      >
        Save
      </Button>

      {/* ADD THEME DIALOG */}
      <AddThemeDialog
        open={showAddThemeDialog}
        setOpen={setShowAddThemeDialog}
        setEnabledThemes={setEnabledThemes}
        enabledThemes={enabledThemes}
        disabledThemes={disabledThemes}
      />

      {/* EDIT THEME DIALOG */}
      {themeEdited && (
        <EditThemeDialog
          open={showEditThemeDialog}
          setOpen={setShowEditThemeDialog}
          themeEdited={themeEdited}
          setThemeEdited={setThemeEdited}
          setEnabledThemes={setEnabledThemes}
          setDisabledThemes={setDisabledThemes}
        />
      )}

      {/* CONFIRM DIALOG */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onClickConfirm={handleClickSaveBtn}
        title="Update theme category status"
        text="Are you sure?"
      />
    </Box>
  );
};

export default ThemePage;
