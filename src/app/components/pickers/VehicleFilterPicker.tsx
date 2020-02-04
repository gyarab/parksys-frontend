import {
  useGenericPickerFromPicker,
  GenericModelPicker
} from "./GenericModelPicker";
import React from "react";
import { stylesheet } from "typestyle";
import { Color } from "../../constants";
import { VEHICLE_FILTER_PICKER_SEARCH_QUERY } from "../../constants/Queries";
import { useGenericMultiPicker } from "./GenericModelMultiPicker";
import { Flag, FlagType } from "../Flag";

const styles = stylesheet({
  filterItem: {
    display: "grid",
    gridTemplateColumns: "auto auto",
    gridColumnGap: "0.5em"
  },
  name: {
    display: "block",
    padding: "5px",
    marginTop: "5px",
    marginBottom: "5px"
  }
});

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
