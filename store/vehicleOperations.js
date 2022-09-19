import { createSlice } from "@reduxjs/toolkit";

const vehicleSlice = createSlice({
  name: "vehicles",
  initialState: {
    vehicles: [],
  },
  reducers: {
    setVehicles: (state, action) => {
      state.vehicles = action.payload;
    },
    addVehicle: (state, action) => {
      state.vehicles.push(action.payload);
    },
    removeVehicle: (state, action) => {
      state.vehicles.splice(state.vehicles.indexOf(action.payload), 1);
    },
    updateVehicle: (state, action) => {
      const { oldValue, newValue } = action.payload;
      const index = state.vehicles.indexOf(oldValue);

      state.vehicles.splice(index, 1, newValue);
    },
  },
});

export const setVehicles = vehicleSlice.actions.setVehicles;
export const addVehicle = vehicleSlice.actions.addVehicle;
export const removeVehicle = vehicleSlice.actions.removeVehicle;
export const updateVehicle = vehicleSlice.actions.updateVehicle;
export default vehicleSlice.reducer;
