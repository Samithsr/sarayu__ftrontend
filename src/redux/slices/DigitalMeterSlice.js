import { createSlice } from "@reduxjs/toolkit";

const digitalMeterSlice = createSlice({
  name: "digitalMeter",
  initialState: {
    currentSpeed: 0,
  },
  reducers: {
    updateSpeed(state, action) {
      state.currentSpeed = action.payload;
    },
  },
});

export const { updateSpeed } = digitalMeterSlice.actions;
export default digitalMeterSlice.reducer;
