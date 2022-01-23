import { createSlice } from "@reduxjs/toolkit";

/**
 * STATE
 * All fields:
 * - rooms (array): array of rooms,
 * - selectedChatRoomID (string): id of a selected room.
 * - selectedChatRoomUsers: array of users,
 */

const initialState = {
    rooms: [],
    selectedChatRoomID: '',
    selectedChatRoomUsers: [],
    isLoadingARoom: false,
    newSelectedChatRoomID: '',
}

const manageRoomsSlice = createSlice({
    name: 'manageRooms',
    initialState,
    reducers: {
        resetRoomsStatesToInitial: (state) => {
            state.selectedChatRoomID = '';
            state.newSelectedChatRoomID = '';
            state.rooms = [];
            state.selectedChatRoomUsers = [];
            state.isLoadingARoom = false;
        },
        selectRoom: (state, action) => {
            // Select and load a room:
            state.selectedChatRoomID = action.payload.roomID;
            state.selectedChatRoomUsers = action.payload.users;
            state.newSelectedChatRoomID = '';
        },
        setIsLoadingARoom: (state, action) => {
            // Set to 'true' to activate loading spinner:
            state.isLoadingARoom = action.payload;
        },


        clearRoomList: (state) => {
            state.rooms = [];
        },
        setRoomList: (state, action) => {
            state.rooms = action.payload;
        },



        setSelectedChatRoomID: (state, action) => {
            state.selectedChatRoomID = action.payload;
            state.newSelectedChatRoomID = '';
        },
        clearSelectedChatRoomUserList: (state) => {
            state.selectedChatRoomUsers = [];
        },
        setSelectedChatRoomUserList: (state, action) => {
            state.selectedChatRoomUsers = action.payload;
        },
        selectTemporaryChatRoom: (state, action) => {
            state.selectedChatRoomID = '';
            state.selectedChatRoomUsers = action.payload.users;
        },
        setNewSelectedChatRoomID: (state, action) => {
            state.newSelectedChatRoomID = action.payload;
        }
    },
    extraReducers: {}
});

// Action creators are generated for each case reducer function:
export const {
    resetRoomsStatesToInitial,
    clearRoomList,
    setRoomList,
    selectRoom,
    setIsLoadingARoom,

    setSelectedChatRoomID,
    clearSelectedChatRoomUserList,
    setSelectedChatRoomUserList,
    selectTemporaryChatRoom,
    setNewSelectedChatRoomID
} = manageRoomsSlice.actions;
// Slice Reducer:
export default manageRoomsSlice.reducer;