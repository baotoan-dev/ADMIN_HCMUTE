import { useContext, memo } from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

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

const ContactInformation = () => {
  // GET CONTEXT VALUES
  const { contactInformations } = useContext(AccountContext);

  return (
    <>
      {contactInformations && (
        <>
          {/* ROW */}
          <CssBoxRow>
            {/* EMAIL */}
            <CssBoxCol>
              <TextField
                label="Email"
                variant="outlined"
                InputProps={{
                  readOnly: true,
                }}
                value={contactInformations.email || "Haven't set"}
              />
            </CssBoxCol>

            {/* PHONE */}
            <CssBoxCol>
              <TextField
                label="Phone"
                variant="outlined"
                value={
                  contactInformations.phone
                    ? contactInformations.phone
                    : "Haven't set"
                }
                InputProps={{
                  readOnly: true,
                }}
              />
            </CssBoxCol>
          </CssBoxRow>

          {/* ROW */}
          <CssBoxRow>
            {/* FACEBOOK */}
            <CssBoxCol>
              <TextField
                label="Facebook"
                variant="outlined"
                InputProps={{
                  readOnly: true,
                }}
                value={contactInformations.facebook || "Haven't set"}
              />
            </CssBoxCol>

            {/* LINKEDIN */}
            <CssBoxCol>
              <TextField
                label="LinkedIn"
                variant="outlined"
                InputProps={{
                  readOnly: true,
                }}
                value={contactInformations.linkedin || "Haven't set"}
              />
            </CssBoxCol>
          </CssBoxRow>
        </>
      )}
    </>
  );
};

export default memo(ContactInformation);
