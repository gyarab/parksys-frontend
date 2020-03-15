import React, { useState } from "react";
import { stylesheet } from "typestyle";
import { VehicleParkingSessionPicker } from "./pickers/ParkingSessionPicker";
import { VEHICLE_SESSIONS_BY_ID_QUERY } from "../constants/Queries";
import { useQuery } from "@apollo/react-hooks";
import { BackgroundChange } from "./BackgroundChange";

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
    <>
      <h3>{`Vehicle -- ${vehicle.licensePlate}`}</h3>
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
                <td>
                  <BackgroundChange watched={vehicle.numParkingSessions}>
                    {vehicle.numParkingSessions}
                  </BackgroundChange>
                </td>
                <td>
                  <BackgroundChange watched={vehicle.totalPaidCents}>
                    {vehicle.totalPaidCents / 100}
                  </BackgroundChange>
                </td>
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
    </>
  );
};
