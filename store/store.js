import { configureStore } from "@reduxjs/toolkit";

import vehiclesReducer from "./vehicles";
import vehicleObject from "./vehicleObject";

export const store = configureStore({
  reducer: {
    vehicleNames: vehiclesReducer,
    vehiche: vehicleObject
  },
});
