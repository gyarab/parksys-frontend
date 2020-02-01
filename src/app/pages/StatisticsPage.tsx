import React, { useMemo } from "react";
import { stylesheet } from "typestyle";
import { IStore } from "../redux/IStore";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { useQuery } from "@apollo/react-hooks";
import { STATS_PAGE_DAY_STATS_QUERY } from "../constants/Queries";
import { DayStatsTable } from "../components/DayStatsTable";

export interface IStateToProps {}

export interface IDispatchToProps {
  useFetchStats: () => any;
}

export interface IProps extends IStateToProps, IDispatchToProps {}

const styles = stylesheet({});

const StatisticsPage = (props: IProps): JSX.Element => {
  const columns = useMemo(
    () => [
      {
        Header: "Day",
        accessor: "day"
      },
      {
        Header: "Revenue",
        accessor: "revenueCents",
        Cell({ row }) {
          return row.original.revenueCents / 100;
        }
      },
      {
        Header: "# of sessions",
        accessor: "numParkingSessions"
      }
    ],
    []
  );
  const { loading, error, data } = props.useFetchStats();
  console.log(data);

  return (
    <div>
      <h2>Stats</h2>
      <DayStatsTable columns={columns} data={loading ? [] : data.dayStats} />
    </div>
  );
};

const mapStateToProps = (state: IStore): IStateToProps => {
  return {};
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchToProps => {
  return {
    // TODO: Fetch interval
    useFetchStats: () => useQuery(STATS_PAGE_DAY_STATS_QUERY)
  };
};

const connected = connect(mapStateToProps, mapDispatchToProps)(StatisticsPage);

export {
  connected as StatisticsPage,
  StatisticsPage as UnconnectedStatisticsPage
};
