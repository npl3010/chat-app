import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
}

const userAuthSlice = createSlice({
    name: 'userAuth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
    },
    extraReducers: {}
});

// Action creators are generated for each case reducer function:
export const { setUser } = userAuthSlice.actions;
// Slice Reducer:
export default userAuthSlice.reducer;