import { useParams } from "react-router-dom";
import { Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { UserDetail } from "components";
import { usePermission } from "hooks";
import { useState } from "react";

const AccountDetailPage = () => {
  usePermission();

  const theme = useTheme();

  // GET ACCOUNT ID AND ROLE
  const { id } = useParams();

  return (
    <div style={{
      padding: "1rem",
    }}>
      <Typography sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        // warp 
        flexWrap: 'wrap',
      }}>
        <Typography variant="h2" p="2rem 0" color={theme.palette.color.main}>
        Account details
        </Typography>
      </Typography>
      <>
        <UserDetail accountId={id} />
      </>
    </div>
  );
};

export default AccountDetailPage;
