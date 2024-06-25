import { createSlice } from "@reduxjs/toolkit";
import { axios } from "configs";

const initialState = {
  notificationCompanies: [],
  error: false,
  loading: false,
};

export const getNotificationCompaniesAction = () => async (dispatch) => {
  dispatch(getNotificationCompanies());
  try {
    const accessToken = sessionStorage.getItem("access-token");
    const response = await axios.get(`/v1/notification/companies`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    dispatch(getNotificationCompaniesSuccess(response.data));
  } catch (error) {
    dispatch(getNotificationCompaniesFailure());
  }
};

const getNotificationCompaniesSlice = createSlice({
  name: "notificationCompanies",
  initialState,
  reducers: {
    getNotificationCompanies: (state) => {
      state.loading = true;
    },
    getNotificationCompaniesSuccess: (state, action) => {
      state.notificationCompanies = action.payload;
      state.loading = false;
      state.error = false;
    },
    getNotificationCompaniesFailure: (state) => {
      state.loading = false;
      state.error = true;
    },
  },
});

export const {
  getNotificationCompanies,
  getNotificationCompaniesSuccess,
  getNotificationCompaniesFailure,
} = getNotificationCompaniesSlice.actions;

export default getNotificationCompaniesSlice.reducer;
