// features/user/userSlice.js
import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
const initialState = {
  signed: false,
  token: Cookies.get("auth_token"),
  loading: true,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    sign(state, action) {
      state.signed = action.payload.success;
      state.token = action.payload.token;
      state.loading = false;
    },
    loading(state, action) {
      state.loading = action;
    },
  },
});

export const { sign, loading } = userSlice.actions;

export default userSlice.reducer;
