import {
  useGenericPickerFromPicker,
  GenericModelPicker
} from "./generic/GenericModelPicker";
import React from "react";
import { stylesheet } from "typestyle";
import { VEHICLE_FILTER_PICKER_SEARCH_QUERY } from "../../constants/Queries";
import { useGenericMultiPicker } from "./generic/GenericModelMultiPicker";
import { Flag, FlagType } from "../Flag";

const RenderVehicleFilter = model => (
  <div>
    <Flag
      text={model.action.substr(0, 3)}
      type={model.action === "EXCLUDE" ? FlagType.NEGATIVE : FlagType.POSITIVE}
    />
    {model.name}
  </div>
);

export const VehicleFilterPicker = GenericModelPicker({
  QUERY: VEHICLE_FILTER_PICKER_SEARCH_QUERY,
  arrayGetter: data => data.vehicleFilterSearch.data,
  renderModel: RenderVehicleFilter,
  identifierToOptions: name => ({ variables: { name } })
});

export const useVehicleFilterPicker = useGenericPickerFromPicker(
  VehicleFilterPicker,
  model => model.name
);

export const useVehicleFilterMultiPicker = useGenericMultiPicker({
  QUERY: VEHICLE_FILTER_PICKER_SEARCH_QUERY,
  arrayGetter: data => data.vehicleFilterSearch.data,
  renderModel: RenderVehicleFilter,
  identifierAndCurrentModelsToOptions: (name, _) => ({ variables: { name } }),
  modelToIdentifier: model => model.name
});
