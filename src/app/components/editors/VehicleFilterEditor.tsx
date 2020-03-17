import React, { useState, useEffect } from "react";
import {
  useVehicleFilterPicker,
  VehicleFilterPicker
} from "../pickers/VehicleFilterPicker";
import { useTwoPicker } from "../pickers/TwoPicker";
import { stylesheet } from "typestyle";
import { Input } from "../Input";
import { useVehicleMultiPicker } from "../pickers/VehiclePicker";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import {
  SET_VEHICLE_FILTER,
  SetVehicleFilter
} from "../../redux/modules/rulePageActionCreators";
import { IRulePageState } from "../../redux/modules/rulePageModule";
import { IStore } from "../../redux/IStore";
import { Button } from "../Button";
import SaveStatus from "../../constants/SaveStatus";
import { useMutation, MutationTuple } from "@apollo/react-hooks";
import {
  RULE_PAGE_UPDATE_VEHICLE_FILTER,
  RULE_PAGE_DELETE_VEHICLE_FILTER,
  RULE_PAGE_CREATE_VEHICLE_FILTER
} from "../../constants/Mutations";
import { styles } from "./common";

export interface IStateToProps {
  vehicleFilter: IRulePageState["selectedVehicleFilter"];
}

export interface IDispatchToProps {
  setSelectedVehicleFilter: (payload: SetVehicleFilter["payload"]) => void;
  useUpdateVehicleFilter: () => MutationTuple<any, { id: string; input: any }>;
  useDeleteVehicleFilter: () => MutationTuple<any, { id: string }>;
  useCreateVehicleFilter: () => MutationTuple<any, { input: any }>;
}

export interface IProps extends IStateToProps, IDispatchToProps {}

export const VehicleFilterEditor = ({
  filter,
  del,
  save,
  saveStatus,
  isNew
}) => {
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
        <input
          type="text"
          value={name}
          onChange={event => setName(event.target.value)}
        />
        <span>Vehicles</span>
        {vehicleMultiPicker}
      </div>

      <div className={styles.controls}>
        <Button onClick={() => del()} type="negative" disabled={isNew}>
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
  const [isNew, setIsNew] = useState<boolean>(false);
  const [updateEffect] = props.useUpdateVehicleFilter();
  const [deleteEffect] = props.useDeleteVehicleFilter();
  const [createEffect] = props.useCreateVehicleFilter();

  const onSuccess = ({ data, errors }) => {
    setSaveStatus(SaveStatus.NONE);
    props.setSelectedVehicleFilter(null);
    setIsNew(false);
  };
  const onFailed = err => {
    setSaveStatus(SaveStatus.FAILED);
  };

  const save = obj => {
    setSaveStatus(SaveStatus.SAVING);
    const promise = isNew
      ? createEffect({ variables: { input: obj } })
      : updateEffect({
          variables: {
            id: props.vehicleFilter.id,
            input: obj
          }
        });
    promise.then(onSuccess).catch(onFailed);
  };
  const del = () => {
    setSaveStatus(SaveStatus.SAVING);
    deleteEffect({
      variables: { id: props.vehicleFilter.id }
    })
      .then(onSuccess)
      .catch(onFailed);
  };
  const toggleNew = () => {
    if (isNew) {
      props.setSelectedVehicleFilter(null);
    } else {
      props.setSelectedVehicleFilter({
        id: null,
        name: "",
        action: "INCLUDE",
        vehicles: []
      });
    }
    setSaveStatus(SaveStatus.NONE);
    setIsNew(!isNew);
  };

  useEffect(() => {
    if (!!props.vehicleFilter && !!props.vehicleFilter.id) {
      setIsNew(false);
    }
  }, [props.vehicleFilter]);

  return (
    <div>
      <div className={styles.header}>
        <h3>Vehicle Filters</h3>
        <Button type="primary" onClick={toggleNew}>
          {isNew ? "Abort New" : "New"}
        </Button>
      </div>
      {isNew ? null : (
        <VehicleFilterPicker
          identifier={!!props.vehicleFilter ? props.vehicleFilter.name : ""}
          onSelect={filter => props.setSelectedVehicleFilter(filter)}
        />
      )}
      <div style={{ marginBottom: "0.5em" }}></div>
      {!!props.vehicleFilter ? (
        <VehicleFilterEditor
          del={del}
          save={save}
          saveStatus={saveStatus}
          filter={props.vehicleFilter}
          isNew={isNew}
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
    useDeleteVehicleFilter: () => useMutation(RULE_PAGE_DELETE_VEHICLE_FILTER),
    useCreateVehicleFilter: () => useMutation(RULE_PAGE_CREATE_VEHICLE_FILTER)
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
