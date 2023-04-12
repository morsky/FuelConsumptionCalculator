import { createSlice } from "@reduxjs/toolkit";

const langulageSlice = createSlice({
  name: "langulage",
  initialState: {},
  reducers: {
    setLangulage: (state, action) => {
      state.langulage = action.payload;
    },
  },
});

export const setLangulage = langulageSlice.actions.setLangulage;
export default langulageSlice.reducer;
