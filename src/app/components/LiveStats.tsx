import { LIVE_STATS_QUERY } from "../constants/Queries";
import { useQuery } from "@apollo/react-hooks";
import React from "react";

export const LiveStats = () => {
  const { data, loading, error, networkStatus } = useQuery(LIVE_STATS_QUERY, {
    pollInterval: 3000
  });
  if (error) {
    return <div>ERROR: {error}</div>;
  }
  if (loading || !data) {
    return <div>Loading</div>;
  }
  const stats = data.liveStats;
  return (
    <div>
      <h3>Live Stats</h3>
      <table>
        <tr>
          <td># active sessions</td>
          <td>{stats.numActiveParkingSessions}</td>
        </tr>
      </table>
    </div>
  );
};
