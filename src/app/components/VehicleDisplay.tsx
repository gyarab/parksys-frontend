import React, { useState } from "react";
import { stylesheet } from "typestyle";
import { VehicleParkingSessionPicker } from "./pickers/ParkingSessionPicker";
import { VEHICLE_SESSIONS_BY_ID_QUERY } from "../constants/Queries";
import { useQuery } from "@apollo/react-hooks";

const styles = stylesheet({
  vehicleDisplay: {
    display: "grid",
    gridTemplateColumns: "auto auto"
  }
});

export const VehicleDisplay = ({ vehicle: vehicle_, setParkingSession }) => {
  const { data, loading, error } = useQuery(VEHICLE_SESSIONS_BY_ID_QUERY, {
    variables: { id: vehicle_.id },
    pollInterval: 5000
  });
  const [session, setSession_] = useState(null);
  const setSession = session => {
    console.log("SET FROM VEH");
    setSession_(session);
    setParkingSession(session);
  };

  if (loading || !data) {
    return <div>Loading</div>;
  } else if (error) {
    return <div>ERROR: {error}</div>;
  }
  const vehicle = {
    ...data.vehicle,
    ...vehicle_
  };
  return (
    <div className={styles.vehicleDisplay}>
      <div>
        <table>
          <thead>
            <tr>
              <th># of Sessions</th>
              <th>Total Fees</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{vehicle.numParkingSessions}</td>
              <td>{vehicle.totalPaidCents / 100}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        <h4 style={{ marginTop: 0 }}>
          Parking Sessions for {vehicle.licensePlate}
        </h4>
        <VehicleParkingSessionPicker
          options={{
            variables: { licensePlate: vehicle.licensePlate },
            pollInterval: 5000
          }}
          model={session}
          onSelect={setSession}
        />
      </div>
    </div>
  );
};
