import { createSlice } from "@reduxjs/toolkit";

const UserDetailsSlice = createSlice({
  name: "userDetails",
  initialState: {
    userDetails: {},
  },
  reducers: {
    setUserDetails(state, action) {
      state.userDetails = action.payload;
    },
  },
});

export const { setUserDetails } = UserDetailsSlice.actions;
export default UserDetailsSlice.reducer;
