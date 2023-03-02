import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import followingsReducer from "./features/followingsSlice";
import usersReducer from "./features/usersSlice";
import postsReducer from "./features/postsSlice";
import profileReducer from "./features/profileSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    followings: followingsReducer,
    users: usersReducer,
    posts: postsReducer,
    profile: profileReducer,
  },
});
