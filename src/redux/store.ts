import { configureStore } from '@reduxjs/toolkit'
import authReducer from './auth-slice'

export const store = configureStore({
    reducer: {
        authReduce: authReducer,
    }
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
