import { createSlice } from "@reduxjs/toolkit";

const vehicleSlice = createSlice({
  name: "vehicle",
  initialState: {},
  reducers: {
    setVehicle: (state, action) => {
      state.vehicle = action.payload;
    },
    setVehicleName: (state, action) => {
      state.vehicle.name = action.payload;
    },
  },
});

export const setVehicle = vehicleSlice.actions.setVehicle;
export const setVehicleName = vehicleSlice.actions.setVehicleName;
export default vehicleSlice.reducer;
