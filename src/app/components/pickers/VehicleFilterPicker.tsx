import {
  useGenericPickerFromPicker,
  GenericModelPicker
} from "./GenericModelPicker";
import React from "react";
import { stylesheet } from "typestyle";
import { Color } from "../../constants";
import { VEHICLE_FILTER_PICKER_SEARCH_QUERY } from "../../constants/Queries";

const styles = stylesheet({
  EXCLUDE: {
    backgroundColor: Color.LIGHT_RED
  },
  INCLUDE: {
    backgroundColor: Color.AQUAMARINE
  },
  action: {
    padding: "5px"
  }
});

export const VehicleFilterPicker = GenericModelPicker({
  QUERY: VEHICLE_FILTER_PICKER_SEARCH_QUERY,
  arrayGetter: data => data.vehicleFilterSearch.data,
  renderModel: model => (
    <>
      <span className={`${styles[model.action]} ${styles.action}`}>
        {model.action}
      </span>{" "}
      {model.name}
    </>
  ),
  identifierToOptions: name => ({ variables: { name } })
});

export const useVehicleFilterPicker = useGenericPickerFromPicker(
  VehicleFilterPicker,
  model => model.name
);
