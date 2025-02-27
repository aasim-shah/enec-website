import { createSlice, Slice } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
  userProfile: any;
}
const initialState: AuthState = {
  token: null,
  userProfile: {},
};

const authSlice: Slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },

    setUserProfile: (state, action) => {
      state.userProfile = action.payload;
    },
    handleLogout: (state) => {
      state.token = null;
      state.userProfile = null;
      localStorage.removeItem("token");
    },
    resetAuth: () => initialState,
  },
});

export const { setToken, setUserProfile, handleLogout, resetAuth } =
  authSlice.actions;
export default authSlice.reducer;
