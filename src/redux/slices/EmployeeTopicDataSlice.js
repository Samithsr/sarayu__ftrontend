import { createSlice } from "@reduxjs/toolkit";

const EmployeeTopicDataSlice = createSlice({
  name: "EmployeeTopicDataSlice",
  initialState: {
    data: [],
  },
  reducers: {
    setTopicData(state, action) {
      state.data.push(action.payload);
    },
  },
});

export const { setTopicData } = EmployeeTopicDataSlice.actions;
export default EmployeeTopicDataSlice.reducer;
