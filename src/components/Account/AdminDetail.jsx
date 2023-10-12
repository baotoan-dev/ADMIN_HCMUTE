import { Box } from "@mui/material";
import { TextField } from "components";

const AdminDetail = ({ accountData }) => {
  return (
    <>
      {/* ROW */}
      <Box
        mb={2}
        sx={{
          "& > :not(style)": { m: 1, width: "45%" },
        }}
      >
        {/* ID */}
        <TextField
          label="ID"
          variant="outlined"
          InputProps={{
            readOnly: true,
          }}
          value={accountData.user_id}
          onChange={(e) => {}}
        />

        {/* ROLE */}
        <TextField
          label="Role"
          variant="outlined"
          InputProps={{
            readOnly: true,
          }}
          value={"Admin"}
          onChange={(e) => {}}
        />
      </Box>
      {/* ROW */}
      <Box
        mb={2}
        sx={{
          "& > :not(style)": { m: 1, width: "45%" },
        }}
      >
        {/* NAME */}
        <TextField
          label="Name"
          variant="outlined"
          InputProps={{
            readOnly: true,
          }}
          value={accountData.name}
          onChange={(e) => {}}
        />

        {/* EMAIL */}
        <TextField
          label="Email"
          variant="outlined"
          InputProps={{
            readOnly: true,
          }}
          value={accountData.email}
          onChange={(e) => {}}
        />
      </Box>
    </>
  );
};

export default AdminDetail;
