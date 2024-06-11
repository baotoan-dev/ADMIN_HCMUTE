import { useEffect, useState, memo, createContext } from "react";
import { Stack, Skeleton, Typography, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { axios } from "configs";
import { Button } from "antd";
import {
  AccountPersonalInformation,
  AccountContactInformation,
  AccountCategories,
  AccountLocations,
  AccountEducations,
  AccountExperiences,
} from "components";
import ModalBlockUser from "../../pages/Account/Modal/ModalBlockUser";

export const AccountContext = createContext();

const UserDetail = ({ accountId }) => {
  const theme = useTheme();
  const [isActive, setIsActive] = useState(false);
  const [accountData, setAccountData] = useState(null);

  const [basicInformations, setBasicInformations] = useState(null);
  const [contactInformations, setContactInformations] = useState(null);
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [educations, setEducations] = useState([]);
  const [experiences, setExperiences] = useState([]);

  // GET ACCOUNT DATA
  useEffect(() => {
    // ACCOUNT DATA
    const getAccountDataFromApi = async (accountId) => {
      if (accountId) {
        const res = await axios.get(`/v1/profiles/s?id=${accountId}`);
        if (res.success) {
          setAccountData(res.data);
          const {
            id,
            name,
            birthday,
            address,
            gender,
            introduction,
            phone,
            email,
            avatar,
            facebook,
            linkedin,
            categories,
            locations,
            educations,
            experiences,
          } = res.data;

          // SET BASIC INFORMATIONS
          setBasicInformations({
            id,
            name,
            birthday,
            gender,
            address,
            introduction,
            avatar,
          });

          // SET CONTACT INFORMATION
          setContactInformations({
            email,
            phone,
            facebook,
            linkedin,
          });

          // SET CATEGORIES
          setCategories(categories);

          // SET LOCATIONS
          setLocations(locations);

          // SET EDUCATIONS
          setEducations(educations);

          // SET EXPERIENCES
          setExperiences(experiences);
        }
      }
    };

    //
    if (accountId) {
      getAccountDataFromApi(accountId);
    }
  }, [accountId]);

  const ContextValues = {
    basicInformations,
    setBasicInformations,
    contactInformations,
    setContactInformations,
    locations,
    categories,
    educations,
    experiences,
  };


  return (
    <AccountContext.Provider value={ContextValues}>
      {accountData ? (
        <>
          <Button type="default" style={{
            backgroundColor: accountData.status === 1 ? "#f5222d" : "#52c41a",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            alignItems: "center",
            boxShadow: "0 1px 1px black",
          }}
            onClick={() => setIsActive(true)}
          >
            {
              accountData.status === 1 ? 'Block' : 'Unblock'
            }
          </Button>
          <ModalBlockUser isActive={isActive} setIsActive={setIsActive} userId={accountId} />
          {/* PERSONAL INFORMATION */}
          <Box p="2rem 0">
            <Typography mb="2rem" variant="h3" color={theme.palette.color.main}>
              Personal informations
            </Typography>
            <AccountPersonalInformation />
          </Box>

          {/* CONTACT INFORMATION */}
          <Box p="2rem 0">
            <Typography mb="2rem" variant="h3" color={theme.palette.color.main}>
              Contact informations
            </Typography>

            <AccountContactInformation />
          </Box>

          {/* CATEGORIES */}
          <Box p="2rem 0">
            <Typography mb="2rem" variant="h3" color={theme.palette.color.main}>
              Categories
            </Typography>

            <AccountCategories
              categories={categories}
              setCategories={setCategories}
            />
          </Box>

          {/* LOCATIONS */}
          <Box p="2rem 0">
            <Typography mb="2rem" variant="h3" color={theme.palette.color.main}>
              Locations
            </Typography>

            <AccountLocations
              locations={locations}
              setLocations={setLocations}
            />
          </Box>

          {/* EDUCATIONS */}
          <Box p="2rem 0">
            <Typography mb="2rem" variant="h3" color={theme.palette.color.main}>
              Educations
            </Typography>

            <AccountEducations
              educations={educations}
              setEducations={setEducations}
            />
          </Box>

          {/* EXPERIENCES */}
          <Box p="2rem 0">
            <Typography mb="2rem" variant="h3" color={theme.palette.color.main}>
              Experiences
            </Typography>

            <AccountExperiences
              experiences={experiences}
              setExperiences={setExperiences}
            />
          </Box>
        </>
      ) : (
        <Stack spacing={1}>
          {/* For variant="text", adjust the height via font-size */}
          <Skeleton variant="text" sx={{ fontSize: "1rem" }} animation="wave" />
          {/* For other variants, adjust the size with `width` and `height` */}
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="rectangular" width={210} height={60} />
          <Skeleton variant="rounded" width={210} height={60} />
        </Stack>
      )}
    </AccountContext.Provider>
  );
};

export default memo(UserDetail);
