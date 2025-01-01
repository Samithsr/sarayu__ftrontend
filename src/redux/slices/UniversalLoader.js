import { createSlice } from "@reduxjs/toolkit";

const UniversalLoader = createSlice({
  name: "UniversalLoader",
  initialState: {
    loading: false,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setLoading } = UniversalLoader.actions;
export default UniversalLoader.reducer;
