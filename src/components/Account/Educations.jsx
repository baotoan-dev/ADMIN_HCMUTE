import { useContext, memo } from "react";
import { useTheme } from "@mui/material/styles";
import moment from "moment";

import { AccountContext } from "./UserDetail";
import { Typography } from "@mui/material";

const Educations = () => {
  const theme = useTheme();

  // GET CONTEXT VALUES
  const { educations } = useContext(AccountContext);

  return (
    <>
      {educations.length > 0 ? (
        <ul>
          {educations.map((education) => (
            <li
              key={education.id}
              style={{
                color: theme.palette.color.main,
                borderBottom: theme.palette.border,
                padding: "1rem 0",
              }}
            >
              <p>{education.id}</p>
              <p>{education.company_name}</p>
              <p>{education.major}</p>
              <p>
                {moment(education.start_date).format("DD/MM/YYYY")} -{" "}
                {moment(education.end_date).format("DD/MM/YYYY")}
              </p>
              <p>{education.extra_information}</p>
            </li>
          ))}
        </ul>
      ) : (
        <Typography color={theme.palette.color.main}>Empty</Typography>
      )}
    </>
  );
};

export default memo(Educations);
