import React from "react";
import { VEHICLE_PICKER_SEARCH_QUERY } from "../../constants/Queries";
import { GenericModelPicker } from "./GenericModelPicker";

export const VehiclePicker = GenericModelPicker({
  QUERY: VEHICLE_PICKER_SEARCH_QUERY,
  identifierToOptions: identifier => ({
    variables: { licensePlate: identifier }
  }),
  renderModel: model => <>{model.licensePlate}</>,
  arrayGetter: data => data.vehicleSearch.data
});
