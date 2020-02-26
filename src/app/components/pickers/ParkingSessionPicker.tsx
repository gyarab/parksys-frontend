import React from "react";
import { stylesheet } from "typestyle";
import {
  GenericModelListPicker,
  useGenericListPickerFromListPicker
} from "./GenericModelPicker";
import { PARKING_SESSIONS_PAGED_QUERY } from "../../constants/Queries";
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
  console.log(props);
  const { model, setVehicle } = props;
  return (
    <div className={styles.session}>
      <p>
        {dateToString(model.checkIn.time)} --{" "}
        {model.active ? "" : dateToString(model.checkOut.time)}
      </p>
      <p className="link">
        <a
          onClick={e => {
            e.stopPropagation();
            setVehicle(model.vehicle);
          }}
        >
          <u>
            <Flag text={model.vehicle.licensePlate} />
          </u>
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

export const ParkingSessionPicker = GenericModelListPicker({
  QUERY: PARKING_SESSIONS_PAGED_QUERY,
  identifierToOptions: (date, page) => {
    let m = moment(date);
    if (!m.isValid()) m = moment();
    return {
      variables: {
        filter: {
          gte: m.startOf("day").toDate(),
          lte: m.endOf("day").toDate()
        },
        page
      },
      fetchPolicy: "no-cache"
    };
  },
  arrayGetter: data => {
    return data.parkingSessionsFilter.data;
  },
  renderModel: model => <ConnectedRenderSession model={model} />,
  modelName: "session",
  input: props => (
    <input
      type="date"
      value={props.value || new Date().toISOString().slice(0, 10)}
      onChange={e => {
        if (e.target.value === "") {
          props.onChange({
            target: { value: new Date().toISOString().slice(0, 10) }
          });
        } else {
          props.onChange(e);
        }
      }}
      disabled={props.disabled}
    />
  ),
  clearIdentifierOnSelect: false
});

export const useParkingSessionPicker = useGenericListPickerFromListPicker(
  ParkingSessionPicker
);
