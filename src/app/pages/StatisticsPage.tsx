import React, { useMemo, useEffect, useState } from "react";
import { stylesheet, classes } from "typestyle";
import { IStore } from "../redux/IStore";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { useLazyQuery } from "@apollo/react-hooks";
import { STATS_PAGE } from "../constants/Queries";
import { DayStatsTable } from "../components/DayStatsTable";
import { IStatsPageState } from "../redux/modules/statsPageModule";
import { Color } from "../constants/Color";
import { Button } from "../components/Button";
import {
  CHANGE_SELECTED_TIME,
  ChangeSelectedTime,
  ChangeGraphTime,
  CHANGE_GRAPH_TIME
} from "../redux/modules/statsPageActionCreators";
import moment from "moment";
import { NumberInput } from "../components/pickers/NumberInput";
import { Chart } from "react-google-charts";

export interface IStateToProps {
  selectedPeriod: IStatsPageState["selectedPeriod"];
  graphPeriod: IStatsPageState["graph"];
}

export interface IDispatchToProps {
  setSelectedTime: (payload: ChangeSelectedTime["payload"]) => void;
  setGraphTime: (payload: ChangeGraphTime["payload"]) => void;
  useFetchYearStats: (onCompleted) => any;
  useFetchMonthStats: (onCompleted) => any;
  useFetchDayStats: (onCompleted) => any;
}

export interface IProps extends IStateToProps, IDispatchToProps {}

const styles = stylesheet({
  graphs: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gridColumnGap: "2em",
    marginBottom: "3em"
  },
  periodSelection: {
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

const dataTransform = (inputData, unitKey, max) => {
  const output = Array(max + 1);
  output[0] = ["", "# of Sessions", "Revenue"];
  for (let i = 1; i < output.length; i++) {
    output[i] = [i, 0, 0];
  }
  for (const elem of inputData) {
    const data = elem.data;
    const unit = elem[unitKey];
    output[unit] = [
      output[unit][0],
      data.numParkingSessions,
      data.revenueCents / 100
    ];
  }
  return output;
};

// arg month - 1 is Jan
const daysInMonth = (year: number, month: number) => {
  return new Date(year, month, 0).getDate();
};

const StatisticsPage = (props: IProps): JSX.Element => {
  // Raw data from GraphQL
  const [yearData, setYearData] = useState(null);
  const [monthData, setMonthData] = useState(null);
  const [dayData, setDayData] = useState(null);
  // Graph Data - transformed into x,y pairs
  const [yearGraphData, setYearGraphData] = useState(null);
  const [monthGraphData, setMonthGraphData] = useState(null);
  const [dayGraphData, setDayGraphData] = useState(null);
  // Lazy Queries
  const [loadYear] = props.useFetchYearStats(data => {
    setYearData(data);
    setYearGraphData(dataTransform(data.yearStats.monthly, "month", 12));
  });
  const [loadMonth] = props.useFetchMonthStats(data => {
    const {
      monthStats: { daily, year, month }
    } = data;
    setMonthData(data);
    setMonthGraphData(dataTransform(daily, "date", daysInMonth(year, month)));
  });
  const [loadDay] = props.useFetchDayStats(data => {
    setDayData(dayData);
    setDayGraphData(dataTransform(data.dayStats.hourly, "hour", 24));
  });

  // Choose graph data
  const graphData = useMemo(() => {
    if (props.graphPeriod === "hours") {
      return dayGraphData;
    } else if (props.graphPeriod === "days") {
      return monthGraphData;
    } else if (props.graphPeriod === "months") {
      return yearGraphData;
    }
  }, [props.graphPeriod]);

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
                onClick={() => {
                  props.setSelectedTime({
                    year: props.selectedPeriod.year,
                    month: row.original.month,
                    date: null
                  });
                  props.setGraphTime("days");
                }}
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
                onClick={() => {
                  props.setSelectedTime({
                    date: row.original.date
                  });
                  props.setGraphTime("hours");
                }}
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

  const graphMaker = (title, data, maxX, type?) => (
    <Chart
      width={"100%"}
      height={"400"}
      chartType={type || "Line"}
      loader={<div>Loading Chart</div>}
      data={data}
      options={{
        chart: { title },
        height: 500,
        series: {
          // Gives each series an axis name that matches the Y-axis below.
          0: { axis: "# of Sessions" },
          1: { axis: "Revenue" }
        },
        axes: {
          // Adds labels to each axis; they don't have to match the axis names.
          y: {
            "# of Sessions": { label: "# of Sessions" },
            Revenue: { label: "Revenue" }
          }
        },
        vAxis: {
          viewWindowMode: "explicit",
          viewWindow: {
            max: maxX,
            min: 1
          }
        },
        legend: { position: "none" }
      }}
      rootProps={{ "data-testid": "4" }}
    />
  );
  console.log(monthGraphData);
  return (
    <div>
      <div className={styles.graphs}>
        {props.graphPeriod === "days"
          ? graphMaker(
              `Month: ${props.selectedPeriod.year}-${String(
                props.selectedPeriod.month
              ).padStart(2, "0")}`,
              monthGraphData,
              daysInMonth(
                props.selectedPeriod.year,
                props.selectedPeriod.month
              ),
              null
            )
          : props.graphPeriod === "months"
          ? graphMaker(
              `Year: ${props.selectedPeriod.year}`,
              yearGraphData,
              12,
              null
            )
          : props.graphPeriod === "hours"
          ? graphMaker(
              `Day: ${props.selectedPeriod.year}-${String(
                props.selectedPeriod.month
              ).padStart(2, "0")}-${String(props.selectedPeriod.date).padStart(
                2,
                "0"
              )}`,
              dayGraphData,
              24,
              null
            )
          : null}
      </div>
      <label>
        <span>Year</span>
        <NumberInput
          value={props.selectedPeriod.year}
          onChange={year => {
            props.setSelectedTime({ year, month: null, date: null });
            props.setGraphTime("months");
          }}
        />
        <button onClick={() => props.setGraphTime("months")}>
          Show Per Month Stats
        </button>
      </label>
      <div className={styles.periodSelection}>
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
          {!!monthData &&
          monthData.monthStats.year === props.selectedPeriod.year ? (
            <DayStatsTable
              columns={daysColumns}
              shouldBeHighlighted={() => false}
              data={monthData.monthStats.daily}
            />
          ) : (
            <div>Select month</div>
          )}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: Pick<IStore, "statsPage">): IStateToProps => {
  return {
    selectedPeriod: state.statsPage.selectedPeriod,
    graphPeriod: state.statsPage.graph
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchToProps => {
  return {
    setSelectedTime: payload =>
      dispatch({ type: CHANGE_SELECTED_TIME, payload }),
    setGraphTime: payload => dispatch({ type: CHANGE_GRAPH_TIME, payload }),
    useFetchDayStats: onCompleted =>
      useLazyQuery(STATS_PAGE.DAY, { onCompleted }),
    useFetchMonthStats: onCompleted =>
      useLazyQuery(STATS_PAGE.MONTH, { onCompleted }),
    useFetchYearStats: onCompleted =>
      useLazyQuery(STATS_PAGE.YEAR, { onCompleted })
  };
};

const connected = connect(mapStateToProps, mapDispatchToProps)(StatisticsPage);

export {
  connected as StatisticsPage,
  StatisticsPage as UnconnectedStatisticsPage
};
