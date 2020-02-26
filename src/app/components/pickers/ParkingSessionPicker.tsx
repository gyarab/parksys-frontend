import React from "react";
import { stylesheet } from "typestyle";
import {
  GenericModelListPicker,
  useGenericListPickerFromListPicker
} from "./GenericModelPicker";
import { PARKING_SESSIONS_PAGED_QUERY } from "../../constants/Queries";
import moment from "moment";

const styles = stylesheet({
  session: {
    paddingTop: "0.6em",
    $nest: {
      p: {
        marginTop: 0
      }
    }
  }
});

const RenderSession = session => (
  <div className={styles.session}>
    <p>{session.id}</p>
  </div>
);

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
  renderModel: RenderSession,
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
