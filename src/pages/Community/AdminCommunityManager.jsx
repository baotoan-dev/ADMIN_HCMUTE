import { useState, useEffect} from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Stack,
  Skeleton,
  Button,
  Autocomplete,
  TextField,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { axios } from "configs";
import { communityListColumns } from "configs/table";
import { usePermission } from "hooks";
import TableCommunity from "components/Table/TableCommunity";
import { API_CONSTANT_V3 } from "constant/urlServer";

// PAGE
const AdminCommunityManagerPage = () => {
  usePermission();
  const theme = useTheme();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedType, setSelectedType] = useState(1);
  const [updateLanguage, setUpdateLanguage] = useState(true);

  const handleUpdateLanguage = async (newValue) => {
    setSelectedType(+newValue);
    setUpdateLanguage(!updateLanguage);
  };

  useEffect(() => {
    const getCommunitiesData = async () => {
      let res;

      res = await axios.get(
        `${API_CONSTANT_V3}/v3/communications/news?type=${selectedType}`
      );

      if (res && res.status === 200) {
        setPosts(res.data.communications);
        setIsLoading(false);
      } else {
      }
    };
    getCommunitiesData();
  }, [updateLanguage]);

  const handleSearchFilterParent = (search) => {};

  const optionLangauge = [
    { label: "HijobNews", value: 0 },
    { label: "WorkingStory", value: 1 },
  ];

  return (
    <>
      {isLoading ? (
        <Stack spacing={1}>
          <Skeleton variant="text" sx={{ fontSize: "1rem" }} animation="wave" />
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="rectangular" width={210} height={60} />
          <Skeleton variant="rounded" width={210} height={60} />
        </Stack>
      ) : (
        <>
          <Box
            sx={{
              width: "100%",
              height: `calc(100vh - ${theme.height.navbar} - 6rem)`,
              paddingLeft: "10px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  color: theme.palette.color.main,
                  paddingBottom: "1rem",
                }}
              >
                Danh sách bài Blog
              </Typography>

              <Box>
                <Link to="/admin/community-create">
                  <Button variant="outlined">Tạo bài Blog</Button>
                </Link>
              </Box>
            </Box>

            <Autocomplete
              disablePortal
              size="small"
              options={optionLangauge}
              value={selectedType === 0 ? "News" : "Working Story"}
              onChange={(event, newValue) =>
                handleUpdateLanguage(newValue.value)
              }
              sx={{ width: 180, marginBottom: "1rem" }}
              renderInput={(params) => <TextField {...params} label="Type" />}
            />

            <TableCommunity
              handleSearchFilterParent={handleSearchFilterParent}
              rows={posts}
              type="community"
              columns={communityListColumns}
              showCheckbox={false}
            />
          </Box>
        </>
      )}
    </>
  );
};

export default AdminCommunityManagerPage;
