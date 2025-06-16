// app/store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user/userSlice.js";
import heroReducer from "./features/user/heroSlice.js";

const store = configureStore({
  reducer: {
    user: userReducer,
    hero: heroReducer,
    // add other slices here (movies, playback, etc.)
  },
});
export default store;
