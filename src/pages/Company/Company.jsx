import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { axios } from "configs";
import { Box, Typography } from "@mui/material";
import TableCompany from "components/Table/TableCompany";
import companyListColumn from "configs/table/companyListColumn";

const Company = () => {
  const theme = useTheme();

  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get("http://localhost:1902/api/v3/companies");
        setCompanies(response.data.companies);
      } catch (error) {
        throw error;
      }
    })();
  }, []);

  if (companies.length === 0) {
    return;
  }
  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: `calc(100vh - ${theme.height.navbar} - 6rem)`,
        }}
      >
        <Typography
          variant="h2"
          sx={{
            color: theme.palette.color.main,
            paddingBottom: "1rem",
          }}
        >
          List company
        </Typography>

        <TableCompany rows={companies} columns={companyListColumn} />
      </Box>
    </>
  );
};

export default Company;
