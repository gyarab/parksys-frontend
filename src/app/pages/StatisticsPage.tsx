import React, { useMemo, useEffect } from "react";
import { stylesheet, classes } from "typestyle";
import { IStore } from "../redux/IStore";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import {
  STATS_PAGE_DAY_STATS_QUERY,
  STATS_PAGE_DAY_HOURLY_QUERY
} from "../constants/Queries";
import { DayStatsTable } from "../components/DayStatsTable";
import { IStatsPageState } from "../redux/modules/statsPageModule";
import { Color } from "../constants/Color";
import { Button } from "../components/Button";
import { CHANGE_SELECTED_DAY } from "../redux/modules/statsPageActionCreators";
import { DayStatsDetails } from "../components/DayStatsDetails";
import moment from "moment";

export interface IStateToProps {
  selectedDay: IStatsPageState["selectedDay"];
}

export interface IDispatchToProps {
  setSelectedDay: (day: string) => void;
  useFetchStats: () => any;
  useFetchDetailedStats: () => any;
}

export interface IProps extends IStateToProps, IDispatchToProps {}

const styles = stylesheet({
  split: {
    height: "70%",
    display: "grid",
    gridTemplateColumns: "auto 1fr",
    gridColumnGap: "1em"
  },
  pane: {
    paddingTop: "1em",
    height: "100%"
  },
  leftPane: {
    minWidth: "20em",
    maxWidth: "25em",
    paddingRight: "1em",
    borderRight: `1px solid ${Color.LIGHT_GREY}`
  },
  rightPane: {}
});

const dayStrToArgs = (day: string) => {
  const m = moment(day);
  return {
    year: m.year,
    month: m.year,
    date: m.date
  };
};

const StatisticsPage = (props: IProps): JSX.Element => {
  const { loading, data } = props.useFetchStats();
  const [loadDetailed, { data: detailedData }] = props.useFetchDetailedStats();
  // Detailed data is not cached or stored so this fetches is if needed
  useEffect(() => {
    if (!!props.selectedDay && !detailedData)
      loadDetailed({ variables: { day: props.selectedDay } });
  }, [props.selectedDay]);
  const selectDay = day => {
    props.setSelectedDay(day);
    loadDetailed({
      variables: {
        day
      }
    });
  };
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
          return row.original.data.revenueCents / 100;
        }
      },
      {
        Header: "# of sessions",
        accessor: "data.numParkingSessions"
      },
      {
        Header: "Actions",
        Cell({ row }) {
          return (
            <>
              <Button
                type="primary"
                onClick={() => selectDay(row.original.day)}
              >
                Show
              </Button>
            </>
          );
        }
      }
    ],
    []
  );
  console.log(detailedData);

  return (
    <div className={styles.split}>
      <div className={classes(styles.pane, styles.leftPane)}>
        <DayStatsTable
          columns={columns}
          data={loading ? [] : data.dayStats}
          shouldBeHighlighted={row => row.original.day === props.selectedDay}
        />
      </div>
      <div className={classes(styles.pane, styles.rightPane)}>
        <DayStatsDetails
          day={props.selectedDay}
          data={!!detailedData ? detailedData.dayStatsPerHour.data : []}
        />
      </div>
    </div>
  );
};

const mapStateToProps = (state: Pick<IStore, "statsPage">): IStateToProps => {
  return {
    selectedDay: state.statsPage.selectedDay
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchToProps => {
  return {
    setSelectedDay: day =>
      dispatch({ type: CHANGE_SELECTED_DAY, payload: day }),
    // TODO: Fetch interval
    useFetchStats: () => useQuery(STATS_PAGE_DAY_STATS_QUERY),
    useFetchDetailedStats: () => useLazyQuery(STATS_PAGE_DAY_HOURLY_QUERY)
  };
};

const connected = connect(mapStateToProps, mapDispatchToProps)(StatisticsPage);

export {
  connected as StatisticsPage,
  StatisticsPage as UnconnectedStatisticsPage
};
