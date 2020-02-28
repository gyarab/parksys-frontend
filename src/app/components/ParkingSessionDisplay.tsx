import React from "react";
import { stylesheet } from "typestyle";
import { useQuery } from "@apollo/react-hooks";
import { PARKING_SESSION_BY_ID_QUERY } from "../constants/Queries";
import lodash from "lodash";
import { VehicleLink } from "./VehicleLink";
import { dateDisplay } from "../helpers/componentHelpers";

const styles = stylesheet({
  sessionDisplay: {
    gridTemplateColumns: "auto auto",
    $nest: {
      table: {
        marginBottom: "1em",
        minWidth: "30%"
      }
    }
  }
});

export const ParkingSessionDisplay = ({ session: { id } }) => {
  const { data, loading, error } = useQuery(PARKING_SESSION_BY_ID_QUERY, {
    variables: {
      id
    }
  });
  if (loading || !data) {
    return <div>Loading</div>;
  } else if (error) {
    return <div>ERROR: {error}</div>;
  }
  const session = data.session;
  const [start, end] = dateDisplay(
    lodash.get(session, "checkIn.time"),
    lodash.get(session, "checkOut.time")
  );
  return (
    <div className={styles.sessionDisplay}>
      <table>
        <thead>
          <tr>
            <th>Start</th>
            <th>End</th>
            <th>Total</th>
            <th>Vehicle</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{start}</td>
            <td>{end}</td>
            <td>{session.finalFee / 100}</td>
            <td>
              <VehicleLink vehicle={session.vehicle} />
            </td>
          </tr>
        </tbody>
      </table>
      <div>
        <h4 style={{ marginTop: 0 }}>Applied Rule Assignments</h4>
        <table>
          <thead>
            <tr>
              <th>Start</th>
              <th>End</th>
              <th>Subtotal</th>
              <th># of rules</th>
            </tr>
          </thead>
          <tbody>
            {session.appliedAssignments.map(assignment => {
              const [start, end] = dateDisplay(
                assignment.start,
                assignment.end
              );
              return (
                <tr>
                  <td>{start}</td>
                  <td>{end}</td>
                  <td>{assignment.feeCents}</td>
                  <td>{assignment.rules.length}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
