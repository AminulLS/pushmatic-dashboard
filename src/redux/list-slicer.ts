import { createSlice } from '@reduxjs/toolkit'
import type { ListStates } from '../types/lists'

const initialState: ListStates = {}

const listReducer = createSlice({
    name: 'list',
    initialState,
    reducers: {
        setStateList: (state, action) => ({ ...state, ...action.payload })
    }
})

export const { setStateList } = listReducer.actions
export default listReducer.reducer
