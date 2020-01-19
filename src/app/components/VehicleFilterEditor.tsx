import React, { useState, useEffect } from "react";
import {
  useVehicleFilterPicker,
  VehicleFilterPicker
} from "./pickers/VehicleFilterPicker";
import { useTwoPicker } from "./pickers/TwoPicker";
import { stylesheet } from "typestyle";
import { Input } from "./Input";
import { useVehicleMultiPicker } from "./pickers/VehiclePicker";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import {
  SET_VEHICLE_FILTER,
  SetVehicleFilter
} from "../redux/modules/rulePageActionCreators";
import { IRulePageState } from "../redux/modules/rulePageModule";
import { IStore } from "../redux/IStore";

export interface IStateToProps {
  vehicleFilter: IRulePageState["selectedVehicleFilter"];
}

export interface IDispatchToProps {
  setSelectedVehicleFilter: (payload: SetVehicleFilter["payload"]) => void;
}

export interface IProps extends IStateToProps, IDispatchToProps {}

const styles = stylesheet({
  pickers: {
    display: "grid",
    gridTemplateColumns: "repeat(2, auto)",
    gridGap: "0.3em 0.4em",
    alignItems: "center"
  },
  header: {
    marginBottom: "0.5em",
    display: "grid",
    gridTemplateColumns: "1fr 3fr",
    alignItems: "center",
    justifyItems: "right",
    $nest: {
      div: {
        maxHeight: "2em"
      }
    }
  }
});

export const VehicleFilterEditor = ({ filter }) => {
  const [actionPicker, , { setTextValue: setAction }] = useTwoPicker(
    "EXCLUDE",
    "INCLUDE",
    filter.action === "INCLUDE"
  );
  const [name, setName] = useState(filter.name);
  const [vehicleMultiPicker, , setVehicles] = useVehicleMultiPicker({
    initialModels: filter.vehicles
  });
  return (
    <div className={styles.pickers}>
      <span>Action</span>
      {actionPicker}
      <span>Name</span>
      <Input
        type="text"
        value={name}
        onChange={e => setName(e.target["value"])}
      />
      <span>Vehicles</span>
      {vehicleMultiPicker}
    </div>
  );
};

const VehicleFilterWidget = (props: IProps) => {
  return (
    <div>
      <h3>Vehicle Filters</h3>
      <VehicleFilterPicker
        identifier={props.vehicleFilter ? props.vehicleFilter.name : ""}
        onSelect={filter => props.setSelectedVehicleFilter(filter)}
      />
      {!!props.vehicleFilter ? (
        <VehicleFilterEditor filter={props.vehicleFilter} />
      ) : null}
    </div>
  );
};

const mapStateToProps = (store: Pick<IStore, "rulePage">): IStateToProps => {
  return {
    vehicleFilter: store.rulePage.selectedVehicleFilter
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchToProps => {
  return {
    setSelectedVehicleFilter: payload =>
      dispatch({
        type: SET_VEHICLE_FILTER,
        payload
      })
  };
};

const connected = connect(
  mapStateToProps,
  mapDispatchToProps
)(VehicleFilterWidget);

export {
  connected as VehicleFilterWidget,
  VehicleFilterWidget as UnconnectedVehicleFilterWdiget
};
