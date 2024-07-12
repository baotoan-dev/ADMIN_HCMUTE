import { memo } from "react";
import { Box, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import moment from "moment";

import { TextField } from "components";
const Item = styled(Box)(({ theme }) => ({
  textarea: {
    fontSize: "1rem",
  },
}));

const BasicInformation = ({ basicInformation, setBasicInformation }) => {
  return (
    basicInformation && (
      <Grid container spacing={4}>
        <Grid item xs={12} lg={6}>
          <Item>
            <TextField
              label="ID"
              variant="outlined"
              value={basicInformation.id || "1"}
              InputProps={{
                readOnly: true,
              }}
              onChange={(e) => {}}
              fullWidth
            />
          </Item>
        </Grid>

        {/* Title */}
        <Grid item xs={12} lg={6}>
          <Item>
            <TextField
              label="Tên"
              variant="outlined"
              value={basicInformation.name || ""}
              onChange={(e) => {
                setBasicInformation((prevState) => ({
                  ...prevState,
                  name: e.target.value,
                }));
              }}
              fullWidth
            />
          </Item>
        </Grid>

        {/* URL */}
        <Grid item xs={12} lg={6}>
          <Item>
            <TextField
              label="Tên nút"
              variant="outlined"
              value={basicInformation.nameButton || ""}
              onChange={(e) => {
                setBasicInformation((prevState) => ({
                  ...prevState,
                  nameButton: e.target.value,
                }));
              }}
              fullWidth
            />
          </Item>
        </Grid>

        {/* URL */}
        <Grid item xs={12} lg={6}>
          <Item>
            <TextField
              label="Link"
              variant="outlined"
              value={basicInformation.link || ""}
              onChange={(e) => {
                setBasicInformation((prevState) => ({
                  ...prevState,
                  link: e.target.value,
                }));
              }}
              fullWidth
            />
          </Item>
        </Grid>

        {/* Title */}
        <Grid item xs={12} lg={12}>
          <Item>
            <TextField
              label="Mô tả"
              variant="outlined"
              rows={6}
              multiline
              value={basicInformation.description || "1"}
              onChange={(e) => {
                setBasicInformation((prevState) => ({
                  ...prevState,
                  description: e.target.value,
                }));
              }}
              fullWidth
            />
          </Item>
        </Grid>
      </Grid>
    )
  );
};

export default memo(BasicInformation);
