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
    gridTemplateColumns: "1fr 1fr 1fr",
    gridColumnGap: "1em",
    paddingRight: "4em"
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
  const [loadMonth, { data: monthData }] = props.useFetchMonthStats();
  const [loadDay, { data: dayData }] = props.useFetchDayStats();

  useEffect(() => {
    const period = props.selectedPeriod;
    if (!!period.year) {
      console.log("LOAD YEAR");
      loadYear({
        variables: {
          year: period.year
        }
      });
      if (!!period.month) {
        console.log("LOAD MONTH");
        loadMonth({
          variables: {
            year: period.year,
            month: period.month
          }
        });
        if (!!period.date) {
          console.log("LOAD DAY");
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

  const monthsColumns = useMemo(
    () => [
      {
        Header: "Month",
        accessor: "month"
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
                onClick={() =>
                  props.setSelectedTime({
                    action: "set",
                    time: {
                      year: props.selectedPeriod.year,
                      month: row.original.month
                    }
                  })
                }
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
  const daysColumns = useMemo(
    () => [
      {
        Header: "Day",
        accessor: "date"
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
                onClick={() =>
                  props.setSelectedTime({
                    action: "merge",
                    time: {
                      date: row.original.date
                    }
                  })
                }
              >
                Showx
              </Button>
            </>
          );
        }
      }
    ],
    []
  );

  const chooseData = () => {
    const period = props.selectedPeriod;
    if (!!period.date && !!period.month && !!period.year && !!dayData)
      return ["hour", dayData.dayStats.hourly];
    if (!!period.month && !!period.year && !!monthData)
      return ["date", monthData.monthStats.daily];
    if (!!period.year && !!yearData)
      return ["month", yearData.yearStats.monthly];
    return [null, null];
  };
  const [graphUnitKey, graphData] = chooseData();
  console.log(yearData);
  console.log(monthData);
  return (
    <div>
      <label>
        <span>Year</span>
        <NumberInput
          value={props.selectedPeriod.year}
          onChange={year =>
            props.setSelectedTime({ action: "set", time: { year } })
          }
        />
        <button
          onClick={() =>
            props.setSelectedTime({
              action: "set",
              time: { year: props.selectedPeriod.year }
            })
          }
        >
          Show Per Month Stats
        </button>
      </label>
      <div className={styles.split}>
        <div>
          {!!yearData ? (
            <DayStatsTable
              columns={monthsColumns}
              shouldBeHighlighted={() => false}
              data={yearData.yearStats.monthly}
            />
          ) : null}
        </div>
        <div>
          {!!monthData && !!props.selectedPeriod.month ? (
            <DayStatsTable
              columns={daysColumns}
              shouldBeHighlighted={() => false}
              data={monthData.monthStats.daily}
            />
          ) : (
            <div>Select month</div>
          )}
        </div>
        <DayStatsDetails
          day={JSON.stringify(props.selectedPeriod)}
          data={graphData}
          unitKey={graphUnitKey}
        />
      </div>
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
