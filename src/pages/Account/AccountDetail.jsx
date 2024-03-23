import { useParams } from "react-router-dom";
import { Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { UserDetail } from "components";
import { usePermission } from "hooks";
import { Button } from "antd";
import ModalBlockUser from "./Modal/ModalBlockUser";
import { useState } from "react";

const AccountDetailPage = () => {
  const [isActive, setIsActive] = useState(false);
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
          Chi tiết tài khoản
        </Typography>
        <Button type="default" style={{
          backgroundColor: 'rgb(255, 0, 0)',
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          alignItems: "center",
          boxShadow: "0 1px 1px black",
        }}
          onClick={() => setIsActive(true)}
        >
          Khóa tài khoản
        </Button>
        <ModalBlockUser isActive={isActive} setIsActive={setIsActive} userId={id}/>
      </Typography>
      <>
        <UserDetail accountId={id} />
      </>
    </div>
  );
};

export default AccountDetailPage;
