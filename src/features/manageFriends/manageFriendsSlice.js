import { createSlice } from "@reduxjs/toolkit";

/**
 * STATE
 * All fields:
 * - friendsDocID (string): document id.
 * - friends (array): array of friends,
 * - friendsFrom (array): array of timestamps,
 */

const initialState = {
    friendsDocID: '',
    friends: [],
    friendsFrom: []
}

const manageFriendsSlice = createSlice({
    name: 'manageFriends',
    initialState,
    reducers: {
        resetFriendListState: (state) => {
            state.friendsDocID = '';
            state.friends = [];
            state.friendsFrom = [];
        },
        setFriendListState: (state, action) => {
            state.friendsDocID = action.payload.friendsDocID;
            state.friends = action.payload.friends;
            state.friendsFrom = action.payload.friendsFrom;
        },
    },
    extraReducers: {}
});

// Action creators are generated for each case reducer function:
export const {
    resetFriendListState,
    setFriendListState
} = manageFriendsSlice.actions;
// Slice Reducer:
export default manageFriendsSlice.reducer;