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
import { Button } from "./Button";
import SaveStatus from "../constants/SaveStatus";
import { useMutation, MutationTuple } from "@apollo/react-hooks";
import {
  RULE_PAGE_UPDATE_VEHICLE_FILTER,
  RULE_PAGE_DELETE_VEHICLE_FILTER
} from "../constants/Mutations";

export interface IStateToProps {
  vehicleFilter: IRulePageState["selectedVehicleFilter"];
}

export interface IDispatchToProps {
  setSelectedVehicleFilter: (payload: SetVehicleFilter["payload"]) => void;
  useUpdateVehicleFilter: () => MutationTuple<any, { id: string; input: any }>;
  useDeleteVehicleFilter: () => MutationTuple<any, { id: string }>;
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
  },
  controls: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gridColumnGap: "0.3em",
    marginBottom: "0.5em",
    $nest: {
      button: {
        maxHeight: "3em"
      }
    }
  }
});

export const VehicleFilterEditor = ({ filter, del, save, saveStatus }) => {
  const [actionPicker, { textValue: action }] = useTwoPicker(
    "EXCLUDE",
    "INCLUDE",
    filter.action === "INCLUDE"
  );
  const [name, setName] = useState(filter.name);
  const [vehicleMultiPicker, vehicles] = useVehicleMultiPicker({
    initialModels: filter.vehicles
  });
  return (
    <div>
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

      <div className={styles.controls}>
        <Button onClick={() => del()} type="negative">
          Delete
        </Button>
        <Button
          onClick={() =>
            save({ name, action, vehicles: vehicles.map(v => v.id) })
          }
          type="positive"
        >
          {saveStatus}
        </Button>
      </div>
    </div>
  );
};

const VehicleFilterWidget = (props: IProps) => {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>(SaveStatus.NONE);
  const [updateEffect] = props.useUpdateVehicleFilter();
  const [deleteEffect] = props.useDeleteVehicleFilter();

  const onSuccess = ({ data, errors }) => {
    console.log(data, errors);
    setSaveStatus(SaveStatus.NONE);
    props.setSelectedVehicleFilter(null);
  };
  const onFailed = err => {
    console.log(err);
    setSaveStatus(SaveStatus.FAILED);
  };

  const save = obj => {
    setSaveStatus(SaveStatus.SAVING);
    updateEffect({
      variables: {
        id: props.vehicleFilter.id,
        input: obj
      }
    })
      .then(onSuccess)
      .catch(onFailed);
  };
  const del = () => {
    setSaveStatus(SaveStatus.SAVING);
    deleteEffect({
      variables: { id: props.vehicleFilter.id }
    })
      .then(onSuccess)
      .catch(onFailed);
  };
  const newFilter = () => {
    props.setSelectedVehicleFilter({
      id: "",
      name: "",
      action: "INCLUDE",
      vehicles: []
    });
    setSaveStatus(SaveStatus.NONE);
  };
  return (
    <div>
      <div className={styles.header}>
        <h3>Vehicle Filters</h3>
        <Button type="primary" onClick={newFilter}>
          New
        </Button>
      </div>
      <VehicleFilterPicker
        identifier={props.vehicleFilter ? props.vehicleFilter.name : ""}
        onSelect={filter => props.setSelectedVehicleFilter(filter)}
      />
      {!!props.vehicleFilter ? (
        <VehicleFilterEditor
          del={del}
          save={save}
          saveStatus={saveStatus}
          filter={props.vehicleFilter}
        />
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
      }),
    useUpdateVehicleFilter: () => useMutation(RULE_PAGE_UPDATE_VEHICLE_FILTER),
    useDeleteVehicleFilter: () => useMutation(RULE_PAGE_DELETE_VEHICLE_FILTER)
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
9;
