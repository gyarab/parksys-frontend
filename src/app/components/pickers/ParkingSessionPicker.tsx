import React from "react";
import { stylesheet, classes } from "typestyle";
import {
  PARKING_SESSIONS_PAGED_QUERY,
  VEHICLES_BY_ID_PARKING_SESSIONS_PAGED_QUERY,
} from "../../constants/Queries";
import moment from "moment";
import { VehicleLink } from "../VehicleLink";
import { dateDisplay } from "../../helpers/componentHelpers";
import { Color } from "../../constants";
import {
  GenericModelListPicker,
  useGenericListPickerFromListPicker,
} from "./generic/GenericModelListPicker";

const styles = stylesheet({
  session: {
    paddingTop: "0.6em",
    $nest: {
      p: {
        marginTop: 0,
        marginBottom: "0.6em",
      },
    },
  },
  activeSession: {
    fontWeight: "bold",
  },
});

const RenderSession = ({ model }) => {
  const [start, end] = dateDisplay(
    model.checkIn.time,
    model.active ? null : model.checkOut.time
  );
  return (
    <div
      className={classes(styles.session, model.active && styles.activeSession)}
    >
      <p>
        <span>{model.finalFee / 100}, </span>
        <span>
          {start} --{" "}
          {!end ? <span style={{ color: Color.GREY }}>still active</span> : end}
        </span>
      </p>
      <p className="link">
        {!model.vehicle ? null : <VehicleLink vehicle={model.vehicle} />}
      </p>
    </div>
  );
};

const input = (props) => (
  <input
    type="date"
    value={props.value}
    onChange={props.onChange}
    disabled={props.disabled}
  />
);
const inputNeverEmpty = (props) =>
  input({
    ...props,
    value: props.value || new Date().toISOString().slice(0, 10),
    onChange: (e) => {
      if (e.target.value === "") {
        props.onChange({
          // Use last value
          target: { value: props.value },
        });
      } else {
        props.onChange(e);
      }
    },
  });

const renderModel = (model) => <RenderSession model={model} />;
const identifierToOptions = (date, page) => {
  const m = moment(date);
  return {
    variables: {
      filter: m.isValid()
        ? {
            gte: m.startOf("day").toDate(),
            lte: m.endOf("day").toDate(),
          }
        : undefined,
      page,
      limit: 5,
    },
    fetchPolicy: "no-cache",
  };
};

export const ParkingSessionPicker = GenericModelListPicker({
  QUERY: PARKING_SESSIONS_PAGED_QUERY,
  identifierToOptions,
  arrayGetter: (data) => {
    return data.parkingSessionsFilter.data;
  },
  renderModel,
  modelName: "session",
  input: inputNeverEmpty,
  clearIdentifierOnSelect: false,
  showSelection: false,
  paging: true,
  refetchIntervalMs: 5000,
});

export const useParkingSessionPicker = useGenericListPickerFromListPicker(
  ParkingSessionPicker
);

export const VehicleParkingSessionPicker = GenericModelListPicker({
  QUERY: VEHICLES_BY_ID_PARKING_SESSIONS_PAGED_QUERY,
  identifierToOptions,
  arrayGetter: (data) => data.vehicle.parkingSessions.data,
  renderModel,
  modelName: "session",
  input: inputNeverEmpty, // Can be empty
  paging: true,
  clearIdentifierOnSelect: false,
  showSelection: false,
  refetchIntervalMs: 5000,
});

export const useVehicleParkingSessionPicker = useGenericListPickerFromListPicker(
  VehicleParkingSessionPicker
);
