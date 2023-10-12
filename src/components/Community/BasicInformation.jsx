import { useState, useEffect, memo } from "react";
import { Box, MenuItem, Checkbox, FormControlLabel, Grid } from "@mui/material";
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
        {/* Id */}

        {/* <Grid item xs={12} lg={6}>
          <Item>
            <TextField
              label="Account_id"
              variant="outlined"
              value={basicInformation.account_id || "1"}
              InputProps={{
                readOnly: true,
              }}
              onChange={(e) => {}}
              fullWidth
            />
          </Item>
        </Grid> */}

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

        {/* Created at */}
        <Grid item xs={12} lg={6}>
          <Item>
            <TextField
              label="Ngày tạo"
              variant="outlined"
              value={
                moment(basicInformation.created_at).format(
                  "DD/MM/YYYY HH:mm:ss"
                ) || ""
              }
              InputProps={{
                readOnly: true,
              }}
              onChange={(e) => {}}
              fullWidth
            />
          </Item>
        </Grid>

        {/* Title */}
        <Grid item xs={12} lg={12}>
          <Item>
            <TextField
              label="Tiêu đề"
              variant="outlined"
              value={basicInformation.title || "1"}
              onChange={(e) => {
                setBasicInformation((prevState) => ({
                  ...prevState,
                  title: e.target.value,
                }));
              }}
              fullWidth
            />
          </Item>
        </Grid>

        {/* URL */}
        <Grid item xs={12} lg={12}>
          <Item>
            <TextField
              label="Nội dung bài đăng"
              variant="outlined"
              multiline
              rows={6}
              value={basicInformation.content || ""}
              onChange={(e) => {
                setBasicInformation((prevState) => ({
                  ...prevState,
                  content: e.target.value,
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
