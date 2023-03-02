import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  followings: [],
};

const followingsSlice = createSlice({
  name: "followings",
  initialState,
  reducers: {
    setFollowings: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { setFollowings } = followingsSlice.actions;

export default followingsSlice.reducer;
