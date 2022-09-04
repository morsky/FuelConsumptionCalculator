import { createSlice } from "@reduxjs/toolkit";

const vehicleSlice = createSlice({
  name: "vehicle",
  initialState: {},
  reducers: {
    setVehicle: (state, action) => {
      state.vehicle = action.payload;
    },
  },
});

export const setVehicle = vehicleSlice.actions.setVehicle;
export default vehicleSlice.reducer;
