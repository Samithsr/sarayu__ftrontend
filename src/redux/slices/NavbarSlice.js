import { createSlice } from "@reduxjs/toolkit";

const NavBarSlice = createSlice({
  name: "navbarslice",
  initialState: {
    showMenu: false,
  },
  reducers: {
    handlToggleMenu(state, action) {
      state.showMenu =
        action.payload !== undefined ? action.payload : !state.showMenu;
    },
  },
});

export const { handlToggleMenu } = NavBarSlice.actions;
export default NavBarSlice.reducer;
