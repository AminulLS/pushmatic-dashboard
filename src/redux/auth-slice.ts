import { createSlice } from '@reduxjs/toolkit'
import { AuthProfile } from '../types/admins'

const initialState: AuthProfile = {
    isLoggedIn: false,
    name: 'Guest',
    token: localStorage.getItem('admin_token'),
    permissions: [],
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth: (state, action) => action.payload
    }
})

export const { setAuth } = authSlice.actions
export default authSlice.reducer
