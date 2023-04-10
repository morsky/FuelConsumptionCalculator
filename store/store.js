import { configureStore } from "@reduxjs/toolkit";

import vehicleOperationsReducer from "./vehicleOperations";
import vehicleObjectReducer from "./vehicleObject";
import langulageReducer from "./langulage";

export const store = configureStore({
  reducer: {
    vehicleNames: vehicleOperationsReducer,
    vehiche: vehicleObjectReducer,
    langulage: langulageReducer,
  },
});
