import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    rooms: [],
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
    },
    extraReducers: {}
});

// Action creators are generated for each case reducer function:
export const { clearRoomList, setRoomList } = manageRoomsSlice.actions
// Slice Reducer:
export default manageRoomsSlice.reducer;