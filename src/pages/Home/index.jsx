import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { Card, AreaChart, PieChart } from "components";
import { axios } from "configs";
import { usePermission } from "hooks";

const cards = [
  {
    title: "Total Account",
    link: "/admin/accounts",
  },
  {
    title: "Today account",
    link: "/admin/accounts?is_today=true",
  },
  {
    title: "Total Post",
    link: "/admin/posts",
  },
  {
    title: "Today post",
    link: "/admin/posts?is_today=true",
  },
  {
    title: "Total pending post",
    link: "/admin/posts?status=0",
  },
  {
    title: "Today pending post",
    link: "/admin/posts?is_today=true&status=0",
  },
];

const HomePage = () => {
  usePermission();

  const theme = useTheme();
  const [cardsData, setCardsData] = useState([...cards]);
  const [statisticData, setStatisticData] = useState();
  
  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get("/v1/home-admin/count");
      if (res && res.success) {
        // SET CARDS DATA
        setCardsData((prevState) => {
          const newState = [...prevState];
          newState[0].quantity = res.data.total_account;
          newState[1].quantity = res.data.today_account;
          newState[2].quantity = res.data.total_post;
          newState[3].quantity = res.data.today_post;
          newState[4].quantity = res.data.total_pending_post;
          newState[5].quantity = res.data.today_pending_post;
          return newState;
        });

        // SET STATISTIC DATA
        setStatisticData({
          postPerMonth: res.data.post_per_month,
          accountPerMonth: res.data.account_per_month,
          postPerStatus: res.data.post_per_status,
        });
      }
    };

    fetchData();
  }, []);

  return (
    <Box sx={{ width: "100%", padding: "1rem" }}>
      {/* Cards */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          margin: "1.25rem -0.75rem",
        }}
      >
        {cardsData.map((card) => (
          <Box
            key={card.title}
            sx={{
              width: {
                xs: "50%",
                md: "33.33%",
              },
              marginBottom: "1.25rem",
              padding: "0 0.75rem",
            }}
          >
            <Card data={card} />
          </Box>
        ))}
      </Box>

      {/* Charts */}
      {/* Area */}
      {statisticData && (
        <>
          <Box sx={{ marginBottom: "20px" }}>
            <Box sx={{ display: "flex" }}>
              <Box
                sx={{
                  width: {
                    xs: "100%",
                    md: "50%",
                  },
                }}
              >
                <Box
                  sx={{
                    color: theme.palette.color.main,
                    fontSize: "1.5rem",
                    fontWeight: 600,
                  }}
                >
                  Account per month
                </Box>
                <AreaChart data={statisticData.accountPerMonth} />
              </Box>
              <Box
                sx={{
                  width: {
                    xs: "100%",
                    md: "50%",
                  },
                }}
              >
                <Box
                  sx={{
                    color: theme.palette.color.main,
                    fontSize: "1.5rem",
                    fontWeight: 600,
                  }}
                >
                  Post per month
                </Box>
                <AreaChart data={statisticData.postPerMonth} />
              </Box>
            </Box>
          </Box>

          {/* Bar */}
          {/* <Box sx={{ marginBottom: "20px" }}>
                <Box sx={{ color: theme.palette.color.main, fontSize: "2rem" }}>
                    Bar chart
                </Box>
                <BarChart />
            </Box> */}

          {/* Line */}
          {/* <Box sx={{ marginBottom: "20px" }}>
                <Box sx={{ color: theme.palette.color.main, fontSize: "2rem" }}>
                    Line chart
                </Box>
                <LineChart />
            </Box> */}

          {/* Pie */}

          <Box sx={{ marginBottom: "20px" }}>
            <Box
              sx={{
                width: {
                  xs: "100%",
                  md: "50%",
                },
              }}
            >
              <Box
                sx={{
                  color: theme.palette.color.main,
                  fontSize: "1.5rem",
                  fontWeight: 600,
                }}
              >
                Post per status
              </Box>
              <PieChart data={statisticData.postPerStatus} />
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default HomePage;
