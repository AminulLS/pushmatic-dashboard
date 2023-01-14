import { createSlice } from '@reduxjs/toolkit'
import { ListStates } from '../types/lists';

const initialState: ListStates = {}

const loaderSlice = createSlice({
    name: 'loader',
    initialState,
    reducers: {
        setStateList: (state, action) => ({ ...state, ...action.payload })
    }
})

export const { setStateList } = loaderSlice.actions
export default loaderSlice.reducer
