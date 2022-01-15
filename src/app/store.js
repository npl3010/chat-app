import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import userAuthReducer from "../features/auth/userAuthSlice";
import manageRoomsReducer from "../features/manageRooms/manageRoomsSlice";
import manageFriendsReducer from "../features/manageFriends/manageFriendsSlice";


export const store = configureStore({
    reducer: {
        counter: counterReducer,
        userAuth: userAuthReducer,
        manageRooms: manageRoomsReducer,
        manageFriends: manageFriendsReducer,
    },
});