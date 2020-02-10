import React, { useMemo, useEffect, useState } from "react";
import { stylesheet, classes } from "typestyle";
import { IStore } from "../redux/IStore";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import { STATS_PAGE } from "../constants/Queries";
import { DayStatsTable } from "../components/DayStatsTable";
import { IStatsPageState } from "../redux/modules/statsPageModule";
import { Color } from "../constants/Color";
import { Button } from "../components/Button";
import {
  CHANGE_SELECTED_TIME,
  ChangeSelectedTime
} from "../redux/modules/statsPageActionCreators";
import { DayStatsDetails } from "../components/DayStatsDetails";
import moment from "moment";
import { NumberInput } from "../components/pickers/NumberInput";

export interface IStateToProps {
  selectedPeriod: IStatsPageState["selectedPeriod"];
}

export interface IDispatchToProps {
  setSelectedTime: (payload: ChangeSelectedTime["payload"]) => void;
  useFetchYearStats: () => any;
  useFetchMonthStats: () => any;
  useFetchDayStats: () => any;
}

export interface IProps extends IStateToProps, IDispatchToProps {}

const styles = stylesheet({
  split: {
    height: "70%",
    display: "grid",
    gridTemplateColumns: "auto auto auto 1fr",
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
  const [loadYear, { data: yearData }] = props.useFetchYearStats();
  const [loadMonth, { data: monthData }] = props.useFetchYearStats();
  const [loadDay, { data: dayData }] = props.useFetchDayStats();

  useEffect(() => {
    const period = props.selectedPeriod;
    if (!!props.selectedPeriod.year) {
      loadYear({
        variables: {
          year: period.year
        }
      });
      if (!!props.selectedPeriod.month) {
        loadMonth({
          variables: {
            year: period.year,
            month: period.month
          }
        });
        if (!!props.selectedPeriod.date) {
          loadDay({
            variables: {
              year: period.year,
              month: period.month,
              date: period.date
            }
          });
        }
      }
    }
  }, [props.selectedPeriod]);

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
                // onClick={() => selectDay(row.original.day)}
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
  return (
    <div>
      <label>
        <span>Year</span>
        <NumberInput
          value={props.selectedPeriod.year}
          onChange={year => props.setSelectedTime({ year })}
        />
      </label>
      <div className={styles.split}></div>
    </div>
  );
};

const mapStateToProps = (state: Pick<IStore, "statsPage">): IStateToProps => {
  return {
    selectedPeriod: state.statsPage.selectedPeriod
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchToProps => {
  return {
    setSelectedTime: payload =>
      dispatch({ type: CHANGE_SELECTED_TIME, payload }),
    // TODO: Fetch interval
    useFetchDayStats: () => useLazyQuery(STATS_PAGE.DAY),
    useFetchMonthStats: () => useLazyQuery(STATS_PAGE.MONTH),
    useFetchYearStats: () => useLazyQuery(STATS_PAGE.YEAR)
  };
};

const connected = connect(mapStateToProps, mapDispatchToProps)(StatisticsPage);

export {
  connected as StatisticsPage,
  StatisticsPage as UnconnectedStatisticsPage
};
