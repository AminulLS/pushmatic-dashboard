import { createSlice } from '@reduxjs/toolkit'
import { AuthProfile } from '../types/admins';

const initialState: AuthProfile = {
    isLoggedIn: false,
    name: 'Guest User'

};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setProfile: (state, action) => action.payload
    }
})

export const { setProfile } = authSlice.actions
export default authSlice.reducer
