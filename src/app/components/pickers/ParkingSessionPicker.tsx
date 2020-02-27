import React from "react";
import { stylesheet } from "typestyle";
import {
  GenericModelListPicker,
  useGenericListPickerFromListPicker
} from "./GenericModelPicker";
import {
  PARKING_SESSIONS_PAGED_QUERY,
  VEHICLES_PARKING_SESSIONS_PAGED_QUERY
} from "../../constants/Queries";
import moment from "moment";
import { Flag } from "../Flag";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { CHANGE_SIMULATE_RULES_ASSIGNMENTS_OPTIONS } from "../../redux/modules/rulePageActionCreators";

const styles = stylesheet({
  session: {
    paddingTop: "0.6em",
    $nest: {
      p: {
        marginTop: 0,
        marginBottom: "0.6em"
      }
    }
  }
});

const dateToString = (date: string) =>
  new Date(date).toISOString().slice(0, 16);

// Connect this
interface Props {
  model: any;
  setVehicle: (vehicle: any) => void;
}

const RenderSession = (props: Props) => {
  const { model, setVehicle } = props;
  return (
    <div className={styles.session}>
      <p>
        <span>
          {dateToString(model.checkIn.time)} --{" "}
          {model.active ? "" : dateToString(model.checkOut.time)}
        </span>
        <span> {model.finalFee / 100}</span>
      </p>
      <p className="link">
        <a
          onClick={e => {
            e.stopPropagation();
            setVehicle(model.vehicle);
          }}
        >
          {!!model.vehicle ? (
            <u>
              <Flag text={model.vehicle.licensePlate} />
            </u>
          ) : null}
        </a>
      </p>
    </div>
  );
};

const toDispatch = (dispatch: Dispatch) => ({
  setVehicle: vehicle =>
    dispatch({
      type: CHANGE_SIMULATE_RULES_ASSIGNMENTS_OPTIONS,
      payload: { vehicle }
    })
});

const ConnectedRenderSession = connect(null, toDispatch)(RenderSession);

const input = props => (
  <input
    type="date"
    value={props.value}
    onChange={props.onChange}
    disabled={props.disabled}
  />
);
const inputNeverEmpty = props =>
  input({
    ...props,
    value: props.value || new Date().toISOString().slice(0, 10),
    onChange: e => {
      if (e.target.value === "") {
        props.onChange({
          target: { value: new Date().toISOString().slice(0, 10) }
        });
      } else {
        props.onChange(e);
      }
    }
  });

const renderModel = model => <ConnectedRenderSession model={model} />;
const identifierToOptions = (date, page) => {
  const m = moment(date);
  return {
    variables: {
      filter: m.isValid()
        ? {
            gte: m.startOf("day").toDate(),
            lte: m.endOf("day").toDate()
          }
        : undefined,
      page,
      limit: 4
    },
    fetchPolicy: "no-cache"
  };
};

export const ParkingSessionPicker = GenericModelListPicker({
  QUERY: PARKING_SESSIONS_PAGED_QUERY,
  identifierToOptions,
  arrayGetter: data => {
    return data.parkingSessionsFilter.data;
  },
  renderModel,
  modelName: "session",
  input: inputNeverEmpty,
  clearIdentifierOnSelect: false
});

export const useParkingSessionPicker = useGenericListPickerFromListPicker(
  ParkingSessionPicker
);

export const VehicleParkingSessionPicker = GenericModelListPicker({
  QUERY: VEHICLES_PARKING_SESSIONS_PAGED_QUERY,
  identifierToOptions,
  arrayGetter: data => data.vehicle.data[0].parkingSessions.data,
  renderModel,
  modelName: "session",
  input, // Can be empty
  paging: true,
  clearIdentifierOnSelect: false
});

export const useVehicleParkingSessionPicker = useGenericListPickerFromListPicker(
  VehicleParkingSessionPicker
);
