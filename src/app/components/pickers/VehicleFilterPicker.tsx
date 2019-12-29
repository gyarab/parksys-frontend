import {
  useGenericPickerFromPicker,
  GenericModelPicker
} from "./GenericModelPicker";
import React from "react";
import { stylesheet } from "typestyle";
import { Color } from "../../constants";
import { VEHICLE_FILTER_PICKER_SEARCH_QUERY } from "../../constants/Queries";
import { useGenericMultiPicker } from "./GenericModelMultiPicker";

const styles = stylesheet({
  EXCLUDE: {
    backgroundColor: Color.LIGHT_RED
  },
  INCLUDE: {
    backgroundColor: Color.AQUAMARINE
  },
  action: {
    padding: "5px",
    marginTop: "5px",
    marginBottom: "5px",
    display: "block"
  },
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

export const useVehicleFilterMultiPicker = useGenericMultiPicker({
  QUERY: VEHICLE_FILTER_PICKER_SEARCH_QUERY,
  arrayGetter: data => data.vehicleFilterSearch.data,
  renderModel: model => (
    <div className={styles.filterItem}>
      <span className={styles.name}>{model.name}</span>
      <span className={`${styles[model.action]} ${styles.action}`}>
        {model.action}
      </span>
    </div>
  ),
  identifierAndCurrentModelsToOptions: (name, _) => ({ variables: { name } }),
  modelToIdentifier: model => model.name
});
