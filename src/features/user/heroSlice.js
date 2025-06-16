import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
const initialState = {
  image: null,
  loading: true,
};

const heroSlice = createSlice({
  name: "hero",
  initialState,
  reducers: {
    setImage(state, action) {
      state.image = action.payload.image;
      state.loading = false;
    },
    setLoading(state, action) {
      state.loading = action;
    },
  },
});

export const { setImage, setLoading } = heroSlice.actions;

export default heroSlice.reducer;
