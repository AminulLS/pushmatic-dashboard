import { configureStore } from '@reduxjs/toolkit'
import authReducer from './auth-slice'
import loaderReducer from './loader-slice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        loader: loaderReducer,
    },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
