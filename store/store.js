import { configureStore } from "@reduxjs/toolkit";

import vehicleOperationsReducer from "./vehicleOperations";
import vehicleObjectReducer from "./vehicleObject";

export const store = configureStore({
  reducer: {
    vehicleNames: vehicleOperationsReducer,
    vehiche: vehicleObjectReducer,
  },
});
