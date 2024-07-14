import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  Autocomplete,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { usePermission } from "hooks";
import { styled } from "@mui/material/styles";
import { axios } from "configs";
import { ConfirmDialog } from "components";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { API_CONSTANT_V3 } from "constant/urlServer";

const Item = styled(Box)(({ theme }) => ({
  textarea: {
    fontSize: "1rem",
  },
}));

const AdminLanguageManagerPage = () => {
  usePermission();
  const theme = useTheme();
  const [dataLanguage, setDataLanguage] = useState();
  const [selectedLanguage, setSelectedLanguage] = useState("Vietnamese");
  const [showConfirmUpdate, setShowConfirmUpdate] = useState(false);

  const handleImportFile = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      if (file.type !== "application/json") {
        console.error("Vui lòng chọn một tệp JSON.");
        return;
      }

      const content = await file.text();
      const jsonData = JSON.parse(content);

      setDataLanguage(jsonData);

      // Xử lý dữ liệu JSON ở đây
    } catch (error) {
      console.error("Lỗi khi đọc tệp JSON:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(
        `${API_CONSTANT_V3}/v3/site/languages?lang=vi`
      );

      if (res && res.data) {
        setDataLanguage(res.data);
      }
    };

    fetchData();
  }, []);

  const handleUpdateLanguage = async (newValue) => {

    const res = await axios.get(
      newValue === "Vietnamese"
        ? `${API_CONSTANT_V3}/v3/site/languages?lang=vi`
        : `${API_CONSTANT_V3}/v3/site/languages?lang=en`
    );

    setSelectedLanguage(newValue);

    if (res && res.data) {
      setDataLanguage(res.data);
    }
  };

  const handleConfirmUpload = async () => {
    let res;
    setShowConfirmUpdate(true);
    if (selectedLanguage === "Vietnamese") {
      res = await axios.post(
        `${API_CONSTANT_V3}/v3/site?lang=vi`,
        dataLanguage
      );
    } else {
      res = await axios.post(
        `${API_CONSTANT_V3}/v3/site?lang=en`,
        dataLanguage
      );
    }

    if (res && res.status === 200) {
      toast.success("Modifying language successfully");
      setShowConfirmUpdate(false);
      setDataLanguage();
    } else {
      toast.error("Modifying language failure");
    }
  };

  const optionLangauge = [{ label: "Vietnamese" }, { label: "English" }];

  return (
    <Box sx={{ padding: "1rem" }}>

      <Typography
        variant="h2"
        style={{ marginBottom: "1.5rem" }}
        color={theme.palette.color.main}
      >
        Language Manager
      </Typography>
      <Box sx={{
        display: "flex",
        flexDirection: "row",
        gap: "1rem",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginBottom: "1.5rem",
      }}>
        <Button
          sx={{
            marginBottom: "1.5rem",
            justifyContent: "flex-end",
            position: "relative",
            overflow: "hidden",
          }}
          variant="outlined"
          component="label"
        >
          Upload FILE
          <input
            type="file"
            accept=".json"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              opacity: 0,
            }}
            onChange={(e) => handleImportFile(e)}
          />
        </Button>

        <Autocomplete
          disablePortal
          size="small"
          options={optionLangauge}
          value={selectedLanguage}
          onChange={(event, newValue) => handleUpdateLanguage(newValue.label)}
          sx={{ width: 180, marginBottom: "1rem" }}
          renderInput={(params) => <TextField {...params} label="Language" />}
        />
      </Box>
      <Grid container>
        <Grid item xs={12} lg={12}>
          <Item>
            <TextField
              id="outlined-multiline-flexible"
              multiline
              maxRows={4}
              fullWidth
              value={JSON.stringify(dataLanguage, null, 2)}
              onChange={(e) => {
                const inputValue = e.target.value;
                try {
                  setDataLanguage(JSON.parse(inputValue));
                } catch (error) { }
              }}
              inputProps={{
                style: {
                  height: "550px",
                  cursor: "pointer",
                },
              }}
            />
          </Item>
        </Grid>
      </Grid>

      <Button
        sx={{ marginTop: "1.5rem", justifyContent: "flex-end" }}
        variant="outlined"
        onClick={() => setShowConfirmUpdate(true)}
      >
        Save
      </Button>

      <ConfirmDialog
        isOpen={showConfirmUpdate}
        onClose={() => setShowConfirmUpdate(false)}
        onClickConfirm={handleConfirmUpload}
        title="Update language.."
        text="Are you sure?"
      />
    </Box>
  );
};

export default AdminLanguageManagerPage;
