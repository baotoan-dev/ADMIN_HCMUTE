import { memo, useContext } from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
// import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";

import { TextField } from "components";
import { AccountContext } from "./UserDetail";

// CSS BOX ROW
const CssBoxRow = styled(Box)({
  display: "flex",
  margin: "0 -1rem",
  flexWrap: "wrap",
});

// CSS BOX COL
const CssBoxCol = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down("lg")]: {
    width: "100%",
  },
  [theme.breakpoints.up("lg")]: {
    width: "50%",
  },
  padding: "0 1rem",
  marginBottom: "2rem",
}));

const PersonalInformation = () => {
  // GET CONTEXT VALUES
  const { basicInformations } = useContext(AccountContext);

  return (
    <>
      {basicInformations && (
        <>
          {/* ROW */}
          <CssBoxRow>
            {/* ID */}
            <CssBoxCol>
              <TextField
                label="ID"
                variant="outlined"
                InputProps={{
                  readOnly: true,
                }}
                value={basicInformations.id}
              />
            </CssBoxCol>

            {/* NAME */}
            <CssBoxCol>
              <TextField
                label="Name"
                variant="outlined"
                value={basicInformations.name || "Haven't set"}
                InputProps={{
                  readOnly: true,
                }}
              />
            </CssBoxCol>
          </CssBoxRow>

          {/* ROW */}
          <CssBoxRow>
            {/* BIRTHDAY */}
            <CssBoxCol>
              <TextField
                label="Birthday (mm/dd/yyyy)"
                variant="outlined"
                value={
                  basicInformations.birthday
                    ? moment(basicInformations.birthday)
                        .format("DD/MM/YYYY")
                        .toString()
                    : "Haven't set"
                }
                InputProps={{
                  readOnly: true,
                }}
              />
            </CssBoxCol>

            {/* GENDER */}
            <CssBoxCol>
              <TextField
                label="Gender"
                variant="outlined"
                value={basicInformations.gender === 0 ? "Female" : "Male"}
                InputProps={{
                  readOnly: true,
                }}
              />
            </CssBoxCol>
          </CssBoxRow>

          {/* ROW */}
          <CssBoxRow>
            {/* ADDRESS */}
            <CssBoxCol>
              <TextField
                label="Address"
                variant="outlined"
                value={basicInformations.address.name || "Haven't set"}
                InputProps={{
                  readOnly: true,
                }}
              />
            </CssBoxCol>

            {/* INTRODUCTION */}
            <CssBoxCol>
              <TextField
                label="Introduction"
                variant="outlined"
                value={basicInformations.introduction || "Haven't set"}
                InputProps={{
                  readOnly: true,
                }}
              />
            </CssBoxCol>
          </CssBoxRow>
        </>
      )}
    </>
  );
};

export default memo(PersonalInformation);
