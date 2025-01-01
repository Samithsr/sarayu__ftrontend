import { createSlice } from "@reduxjs/toolkit";

const UserSlice = createSlice({
  name: "UserSlice",
  initialState: {
    user: {},
    logoutToggle: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    handleWarningModel(state, action) {
      state.logoutToggle = !state.logoutToggle;
    },
  },
});

export const { setUser, handleWarningModel } = UserSlice.actions;
export default UserSlice.reducer;
