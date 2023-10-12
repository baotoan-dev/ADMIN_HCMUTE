import { useState, useEffect, memo } from "react";
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

const socialTypes = ["Facebook", "Instagram", "LinkedIn"];

const SelectSnsDialog = ({
  showSelectSnsDialog,
  setShowSelectSnsDialog,
  setSns,
  sns,
}) => {
  const theme = useTheme();

  const [snsType, setSnsType] = useState("");
  const [snsUrl, setSnsUrl] = useState("");
  const [currentTypes, setCurrentTypes] = useState([]);

  useEffect(() => {
    if (sns) {
      setCurrentTypes(sns.map((s) => s.type));
    }
  }, [sns]);

  // HANDLE ADD NEW SNS
  const handleAddNewSns = (e) => {
    if (snsType && snsUrl) {
      setSns((prevState) => [
        ...prevState,
        {
          type: snsType.trim(),
          url: snsUrl.trim(),
        },
      ]);
      setShowSelectSnsDialog(false);
      setSnsType("");
      setSnsUrl("");
    }
  };
  return (
    <>
      <Dialog
        disableEscapeKeyDown
        open={showSelectSnsDialog}
        onClose={() => setShowSelectSnsDialog(false)}
      >
        <DialogTitle
          color={theme.palette.color.main}
          variant="h4"
          sx={{ padding: "20px 24px" }}
        >
          Fill the form
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
          {/* SOCIAL TYPE */}
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
              label="Social type"
              value={snsType}
              onChange={(e) => setSnsType(e.target.value)}
            >
              {socialTypes
                .filter((type) => !currentTypes.includes(type))
                .map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
            </TextField>
          </FormControl>

          {/* SOCIAL URL */}
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
              label="Social url"
              variant="outlined"
              value={snsUrl}
              onChange={(e) => setSnsUrl(e.target.value)}
            />
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ padding: "20px 24px" }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setShowSelectSnsDialog(false)}
          >
            Cancel
          </Button>
          <Button variant="outlined" size="small" onClick={handleAddNewSns}>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default memo(SelectSnsDialog);
