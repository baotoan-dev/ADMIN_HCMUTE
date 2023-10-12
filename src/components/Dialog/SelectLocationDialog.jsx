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

const AccountSelectLocationDialog = ({
  showDialog,
  setShowDialog,
  provinces,
  provinceIdSelected,
  setProvinceIdSelected,
  districts,
  districtIdSelected,
  setDistrictIdSelected,
  handleAddNewLocation,
  currentDistrictIds,
}) => {
  const theme = useTheme();

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
          {/* PROVINCES */}
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
              label="Province"
              value={provinceIdSelected}
              onChange={(e) => setProvinceIdSelected(e.target.value)}
            >
              {provinces &&
                provinces.map((province) => (
                  <MenuItem key={province.id} value={province.id}>
                    {province.name}
                  </MenuItem>
                ))}
            </TextField>
          </FormControl>

          {/* DISTRICT */}
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
              label="District"
              value={districtIdSelected}
              onChange={(e) => setDistrictIdSelected(e.target.value)}
            >
              {districts &&
                districts
                  .filter(
                    (district) => !currentDistrictIds.includes(district.id)
                  )
                  .map((district) => (
                    <MenuItem key={district.id} value={district.id}>
                      {district.name}
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
            onClick={handleAddNewLocation}
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AccountSelectLocationDialog;
