import { createSlice } from "@reduxjs/toolkit";

/**
 * STATE
 * All fields:
 * - friendsDocID (string): document id.
 * - friends (array): array of friends,
 * - friendRequestsSent (array): array of friend requests sent,
 * - friendRequestsReceived (array): array of friend requests received,
 */

const initialState = {
    friendsDocID: '',
    friends: [],
    friendRequestsSent: [],
    friendRequestsReceived: [],
    friendRequestsReceivedAt: [],
    friendRequestsReceivedIsSeen: 0,
}

const manageFriendsSlice = createSlice({
    name: 'manageFriends',
    initialState,
    reducers: {
        resetState: (state) => {
            state.friendsDocID = '';
            state.friends = [];
            state.friendRequestsSent = [];
            state.friendRequestsReceived = [];
            state.friendRequestsReceivedAt = [];
            state.friendRequestsReceivedIsSeen = 0;
        },
        setState: (state, action) => {
            state.friendsDocID = action.payload.friendsDocID;
            state.friends = action.payload.friends;
            state.friendRequestsSent = action.payload.friendRequestsSent;
            state.friendRequestsReceived = action.payload.friendRequestsReceived;
            state.friendRequestsReceivedAt = action.payload.friendRequestsReceivedAt;
            state.friendRequestsReceivedIsSeen = action.payload.friendRequestsReceivedIsSeen;
        },
    },
    extraReducers: {}
});

// Action creators are generated for each case reducer function:
export const {
    resetState,
    setState
} = manageFriendsSlice.actions;
// Slice Reducer:
export default manageFriendsSlice.reducer;