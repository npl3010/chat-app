import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import userAuthReducer from "../features/auth/userAuthSlice";

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        userAuth: userAuthReducer,
    },
});