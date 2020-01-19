import React from "react";
import { VEHICLE_PICKER_SEARCH_QUERY } from "../../constants/Queries";
import { GenericModelPicker } from "./GenericModelPicker";
import { useGenericMultiPicker } from "./GenericModelMultiPicker";

export const VehiclePicker = GenericModelPicker({
  QUERY: VEHICLE_PICKER_SEARCH_QUERY,
  identifierToOptions: identifier => ({
    variables: { licensePlate: identifier }
  }),
  renderModel: model => <>{model.licensePlate}</>,
  arrayGetter: data => data.vehicleSearch.data
});

export const useVehicleMultiPicker = useGenericMultiPicker({
  QUERY: VEHICLE_PICKER_SEARCH_QUERY,
  arrayGetter: data => data.vehicleSearch.data,
  renderModel: model => <>{model.licensePlate}</>,
  identifierAndCurrentModelsToOptions: identifier => ({
    variables: { licensePlate: identifier }
  }),
  modelToIdentifier: model => model.licensePlate
});
