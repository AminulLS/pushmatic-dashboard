import { createSlice } from '@reduxjs/toolkit'
import { AuthProfile } from '../types/admins'

const AUTH_TOKEN_KEY = 'admin_token'
const currentToken = localStorage.getItem('admin_token');

const initialState: AuthProfile = {
    isLoggedIn: false,
    name: 'Guest',
    token: currentToken,
    permissions: [],
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth: (state, action) => {
            const { token } = action.payload

            if (!token) {
                return initialState
            }

            localStorage.setItem(AUTH_TOKEN_KEY, token)

            return action.payload
        },

        unsetAuth: () => {
            localStorage.removeItem(AUTH_TOKEN_KEY)

            return initialState
        }
    }
})

export const { setAuth, unsetAuth } = authSlice.actions
export default authSlice.reducer
