import React from "react";
import { VEHICLE_PICKER_SEARCH_QUERY } from "../../constants/Queries";
import { GenericModelPicker } from "./generic/GenericModelPicker";
import { useGenericMultiPicker } from "./generic/GenericModelMultiPicker";
import {
  GenericModelListPicker,
  useGenericListPickerFromListPicker
} from "./generic/GenericModelListPicker";
import { Flag } from "../Flag";

const renderModel = model => (
  <div style={{ paddingTop: "0.7em", paddingBottom: "0.6em" }}>
    <span>
      <Flag text={model.licensePlate} /> {model.numParkingSessions} sessions
    </span>
  </div>
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
    variables: { licensePlate: identifier, page, limit: 15 }
  }),
  renderModel,
  arrayGetter,
  clearIdentifierOnSelect: true,
  paging: true,
  refetchIntervalMs: 5000
});

export const useVehiclePagedPicker = useGenericListPickerFromListPicker(
  VehiclePagedPicker
);
