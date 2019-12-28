import React from "react";
import { VEHICLE_PICKER_SEARCH_QUERY } from "../../constants/Queries";
import { GenericModelPicker } from "./GenericModelPicker";

export const VehiclePicker = GenericModelPicker(
  VEHICLE_PICKER_SEARCH_QUERY,
  identifier => ({ variables: { licensePlate: identifier } }),
  model => <>{model.licensePlate}</>,
  data => data.vehicleSearch.data
);
