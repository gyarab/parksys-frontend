import React from "react";
import { VEHICLE_PICKER_SEARCH_QUERY } from "../../constants/Queries";
import {
  GenericModelPicker,
  GenericModelListPicker,
  useGenericListPickerFromListPicker
} from "./GenericModelPicker";
import { useGenericMultiPicker } from "./GenericModelMultiPicker";

const renderModel = model => (
  <>
    {model.licensePlate} {model.numParkingSessions} sessions
  </>
);
const arrayGetter = data => data.vehicleSearch.data;

export const VehiclePicker = GenericModelPicker({
  QUERY: VEHICLE_PICKER_SEARCH_QUERY,
  identifierToOptions: identifier => ({
    variables: { licensePlate: identifier, limit: 5 }
  }),
  renderModel,
  arrayGetter
});

export const useVehicleMultiPicker = useGenericMultiPicker({
  QUERY: VEHICLE_PICKER_SEARCH_QUERY,
  arrayGetter,
  renderModel,
  identifierAndCurrentModelsToOptions: identifier => ({
    variables: { licensePlate: identifier }
  }),
  modelToIdentifier: model => model.licensePlate
});

export const VehiclePagedPicker = GenericModelListPicker({
  QUERY: VEHICLE_PICKER_SEARCH_QUERY,
  identifierToOptions: (identifier, page) => ({
    variables: { licensePlate: identifier, page }
  }),
  renderModel,
  arrayGetter,
  clearIdentifierOnSelect: true,
  paging: true
});

export const useVehiclePagedPicker = useGenericListPickerFromListPicker(
  VehiclePagedPicker
);
