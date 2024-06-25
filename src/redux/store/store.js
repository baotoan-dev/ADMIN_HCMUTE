import {configureStore} from '@reduxjs/toolkit';
import profileReducer from '../slice/profileSlice'
import notificationCompaniesReducer from '../slice/notificationCompaniesSlice'

export const store = configureStore({
    reducer: {
        profile: profileReducer,
        notificationCompanies: notificationCompaniesReducer
    }
})

