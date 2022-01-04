import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: 0,
}

const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        increment: (state, action) => {
            state.value += 1;
        },
        decrement: (state, action) => {
            state.value -= 1;
        },
    },
    extraReducers: {}
});

// Action creators are generated for each case reducer function:
export const { increment, decrement } = counterSlice.actions;
// Slice Reducer:
export default counterSlice.reducer;