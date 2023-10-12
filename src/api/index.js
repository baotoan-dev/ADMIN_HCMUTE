import { axios } from "configs";

export const fetchAllLocations = async () => {
  let locations;
  const res = await axios.get("/v1/locations");
  if (res.success) {
    locations = res.data;
    return locations;
  }
};
