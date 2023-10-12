import { useContext, memo } from "react";
import { useTheme } from "@mui/material/styles";
import moment from "moment";

import { AccountContext } from "./UserDetail";
import { Typography } from "@mui/material";

const Experiences = () => {
  const theme = useTheme();

  // GET CONTEXT VALUES
  const { experiences } = useContext(AccountContext);

  return (
    <>
      {experiences.length > 0 ? (
        <ul>
          {experiences.map((experience) => (
            <li
              key={experience.id}
              style={{
                color: theme.palette.color.main,
                borderBottom: theme.palette.border,
                padding: "1rem 0",
              }}
            >
              <p>{experience.id}</p>
              <p>{experience.title}</p>
              <p>{experience.company_name}</p>
              <p>
                {moment(experience.start_date).format("DD/MM/YYYY")} -{" "}
                {moment(experience.end_date).format("DD/MM/YYYY")}
              </p>
              <p>{experience.extra_information}</p>
            </li>
          ))}
        </ul>
      ) : (
        <Typography color={theme.palette.color.main}>Empty</Typography>
      )}
    </>
  );
};

export default memo(Experiences);
