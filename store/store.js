import { configureStore } from "@reduxjs/toolkit";

import vehicleReducer from "./vehicles";

export const store = configureStore({
  reducer: {
    vehicleNames: vehicleReducer,
  },
});
