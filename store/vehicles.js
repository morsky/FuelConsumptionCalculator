import { createSlice } from "@reduxjs/toolkit";

const vehicleSlice = createSlice({
  name: "vehicles",
  initialState: {
    vehicles: [],
  },
  reducers: {
    addVehicle: (state, action) => {
      state.vehicles.push(action.payload);
    },
    removeVehicle: (state, action) => {
      state.vehicles.splice(state.vehicles.indexOf(action.payload), 1);
    },
  },
});

export const addVehicle = vehicleSlice.actions.addVehicle;
export const removeVehicle = vehicleSlice.actions.removeVehicle;
export default vehicleSlice.reducer;
