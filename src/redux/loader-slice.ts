import { createSlice } from '@reduxjs/toolkit'

interface LoadingState {
    booted: boolean

    [name: string]: boolean
}

const initialState: LoadingState = {
    booted: false
}

const loaderSlice = createSlice({
    name: 'loader',
    initialState,
    reducers: {
        setLoader: (state, action) => ({ ...state, ...action.payload })
    }
})

export const { setLoader } = loaderSlice.actions
export default loaderSlice.reducer
