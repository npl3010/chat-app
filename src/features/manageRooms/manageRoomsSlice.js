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
    roomIDWillBeSelected: '',
    temporaryRoom: null,
}

const manageRoomsSlice = createSlice({
    name: 'manageRooms',
    initialState,
    reducers: {
        resetRoomsStatesToInitial: (state) => {
            state.selectedChatRoomID = '';
            state.rooms = [];
            state.selectedChatRoomUsers = [];
            state.roomIDWillBeSelected = '';
            state.isLoadingARoom = false;
            state.temporaryRoom = null;
        },
        clearSelectedRoom: (state) => {
            state.selectedChatRoomID = '';
            state.selectedChatRoomUsers = [];
        },

        // Store the selected room's info:
        selectRoom: (state, action) => {
            // Select and load a room:
            if (state.temporaryRoom === null) {
                state.selectedChatRoomID = action.payload.roomID;
                state.selectedChatRoomUsers = action.payload.users;
            } else {
                if (action.payload.roomID !== state.temporaryRoom?.id) {
                    state.selectedChatRoomID = action.payload.roomID;
                    state.selectedChatRoomUsers = action.payload.users;
                    state.rooms = state.rooms.filter((room) => {
                        return !(room.id === state.temporaryRoom.id);
                    });
                    state.temporaryRoom = null;
                } else {
                    state.selectedChatRoomID = action.payload.roomID;
                    state.selectedChatRoomUsers = action.payload.users;
                }
            }
        },

        // Loading state:
        setIsLoadingARoom: (state, action) => {
            // Set to 'true' to activate loading spinner:
            state.isLoadingARoom = action.payload;
        },

        // Select a room to make the app loads the room's info. Then, store the info using selectRoom():
        setRoomIDWillBeSelected: (state, action) => {
            state.roomIDWillBeSelected = action.payload;
        },

        // TEMPORARY ROOM:
        setTemporaryRoom: (state, action) => {
            state.temporaryRoom = action.payload;
            // Add new temporary room to room list.
            // (If temporary room already exists in room list, update its info).
            let count = 0;
            for (let i = 0; i < state.rooms.length; i++) {
                if (state.rooms[i].id === action.payload.id) {
                    state.rooms[i] = action.payload;
                    count++;
                }
            }
            if (count === 0) {
                state.rooms = [action.payload, ...state.rooms];
            }
        },

        // Room list:
        clearRoomList: (state) => {
            state.rooms = [];
        },
        setRoomList: (state, action) => {
            if (state.temporaryRoom === null) {
                state.rooms = action.payload;
            } else {
                // Check if there is a one-to-one room in the new room list has members like the temporary room.
                // If yes, remove the temporary room.
                // If no, add the temporary room to the new room list.
                const newRooms = [...action.payload];
                let isAbleToRemoveTemporaryRoom = false;

                for (let i = 0; i < newRooms.length; i++) {
                    if (newRooms[i].type === 'one-to-one-chat' && newRooms[i].members.length === 2) {
                        const allFounded = state.temporaryRoom.members.every(uid => {
                            return newRooms[i].members.includes(uid);
                        });
                        if (allFounded === true) {
                            isAbleToRemoveTemporaryRoom = true;
                        }
                        break;
                    }
                }

                if (isAbleToRemoveTemporaryRoom === true) {
                    state.temporaryRoom = null;
                    state.rooms = action.payload;
                } else {
                    state.rooms = [state.temporaryRoom, ...action.payload];
                }
            }
        },

        // Set selectedChatRoomUsers:
        setselectedChatRoomUsers: (state, action) => {
            state.selectedChatRoomUsers = action.payload;
        },
    },
    extraReducers: {}
});

// Action creators are generated for each case reducer function:
export const {
    resetRoomsStatesToInitial,
    clearSelectedRoom,
    selectRoom,
    setIsLoadingARoom,
    setRoomIDWillBeSelected,
    setTemporaryRoom,
    clearRoomList,
    setRoomList,
    setselectedChatRoomUsers
} = manageRoomsSlice.actions;
// Slice Reducer:
export default manageRoomsSlice.reducer;