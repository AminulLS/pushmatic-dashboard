import { createSlice } from '@reduxjs/toolkit'

interface CacheState {
    [name: string]: any
}

const initialState: CacheState = {}

const cache = createSlice({
    name: 'cache',
    initialState,
    reducers: {
        setCache: (state, action) => ({ ...state, ...action.payload })
    }
})

export const { setCache } = cache.actions
export default cache.reducer
