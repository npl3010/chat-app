import { createSlice } from "@reduxjs/toolkit";

/**
 * STATE
 * All fields:
 * - rooms (array): array of rooms,
 * - selectedChatRoom (number): array index,
 * - selectedChatRoomUsers: array of users,
 */

const initialState = {
    rooms: [],
    selectedChatRoom: -1,
    selectedChatRoomUsers: [],
}

const manageRoomsSlice = createSlice({
    name: 'manageRooms',
    initialState,
    reducers: {
        clearRoomList: (state) => {
            state.rooms = [];
        },
        setRoomList: (state, action) => {
            state.rooms = action.payload;
        },
        setSelectedChatRoom: (state, action) => {
            state.selectedChatRoom = action.payload;
        },
        clearSelectedChatRoomUserList: (state) => {
            state.selectedChatRoomUsers = [];
        },
        setSelectedChatRoomUserList: (state, action) => {
            state.selectedChatRoomUsers = action.payload;
        },
        selectTemporaryChatRoom: (state, action) => {
            state.selectedChatRoom = -1;
            state.selectedChatRoomUsers = action.payload.users;
        },
    },
    extraReducers: {}
});

// Action creators are generated for each case reducer function:
export const {
    clearRoomList,
    setRoomList,
    setSelectedChatRoom,
    clearSelectedChatRoomUserList,
    setSelectedChatRoomUserList,
    selectTemporaryChatRoom
} = manageRoomsSlice.actions;
// Slice Reducer:
export default manageRoomsSlice.reducer;