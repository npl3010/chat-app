import { createSlice } from "@reduxjs/toolkit";

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
    },
    extraReducers: {}
});

// Action creators are generated for each case reducer function:
export const {
    clearRoomList,
    setRoomList,
    setSelectedChatRoom,
    clearSelectedChatRoomUserList,
    setSelectedChatRoomUserList
} = manageRoomsSlice.actions;
// Slice Reducer:
export default manageRoomsSlice.reducer;