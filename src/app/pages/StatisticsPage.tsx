import React, { useMemo, useEffect, useState } from "react";
import { stylesheet } from "typestyle";
import { IStore } from "../redux/IStore";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { useLazyQuery } from "@apollo/react-hooks";
import { STATS_PAGE } from "../constants/Queries";
import { StatsTable } from "../components/StatsTable";
import { IStatsPageState } from "../redux/modules/statsPageModule";
import { Color } from "../constants/Color";
import { Button } from "../components/Button";
import {
  CHANGE_SELECTED_TIME,
  ChangeSelectedTime,
  ChangeGraphTime,
  CHANGE_GRAPH_TIME
} from "../redux/modules/statsPageActionCreators";
import { NumberInput } from "../components/pickers/NumberInput";
import { Chart } from "react-google-charts";
import { LiveStats } from "../components/LiveStats";

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
  useFetchYearDayStats: (onCompleted) => any;
}

export interface IProps extends IStateToProps, IDispatchToProps {}

const styles = stylesheet({
  graphs: {
    display: "grid",
    gridTemplateColumns: "auto auto",
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
  rightPane: {},
  calGraphs: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gridTemplateRows: "1fr 1fr"
  }
});

const dataTransform = (
  inputData,
  unitKey,
  max,
  indexFunc = (i, elem?) => i
) => {
  const output = Array(max + 1);
  output[0] = ["", "# of Sessions", "Revenue"];
  for (let i = 1; i < output.length; i++) {
    output[i] = [indexFunc(i), 0, 0];
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

const calendarDataTransform = inputData => {
  const l = inputData.length + 1;
  const revenue = Array(l);
  const sessions = Array(l);
  revenue[0] = [{ type: "date", id: "Date" }, "Revenue"];
  sessions[0] = [{ type: "date", id: "Date" }, "# of Sessions"];
  for (let i = 0; i < inputData.length; i++) {
    const elem = inputData[i];
    const date = new Date(elem.year, elem.month - 1, elem.date);
    revenue[i + 1] = [date, elem.data.revenueCents / 100];
    sessions[i + 1] = [date, elem.data.numParkingSessions];
  }
  return [revenue, sessions];
};

// arg month - 1 is Jan
const daysInMonth = (year: number, month: number) => {
  return new Date(year, month, 0).getDate();
};

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
          min: 1,
          max: maxX
        }
      },
      legend: { position: "none" }
    }}
    rootProps={{ "data-testid": "4" }}
  />
);

const calendarGraphMaker = (title, data) => {
  return (
    <Chart
      width={"1300"}
      height={"400"}
      chartType={"Calendar"}
      loader={<div>Loading Chart</div>}
      data={data}
      options={{
        title
        // legend: { position: "none" }
      }}
      rootProps={{ "data-testid": "1" }}
    />
  );
};

const StatisticsPage = (props: IProps): JSX.Element => {
  // Raw data from GraphQL
  const [yearData, setYearData] = useState(null);
  const [monthData, setMonthData] = useState(null);
  const [dayData, setDayData] = useState(null);
  const [yearDayData, setYearDayData] = useState(null);
  // Graph Data - transformed into x,y pairs
  const [yearGraphData, setYearGraphData] = useState(null);
  const [monthGraphData, setMonthGraphData] = useState(null);
  const [dayGraphData, setDayGraphData] = useState(null);
  const [yearDayGraphData, setYearDayGraphData] = useState(null);
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
    setDayData(data);
    setDayGraphData(dataTransform(data.dayStats.hourly, "hour", 24));
  });
  const [loadYearDay] = props.useFetchYearDayStats(data => {
    setYearDayData(data);
    setYearDayGraphData(calendarDataTransform(data.yearStats.daily));
  });
  useEffect(() => {
    const period = props.selectedPeriod;
    if (!!period.year) {
      loadYear({
        variables: {
          year: period.year
        }
      });
      loadYearDay({
        variables: {
          year: period.year
        }
      });
      if (!!period.month) {
        loadMonth({
          variables: {
            year: period.year,
            month: period.month
          }
        });
        if (!!period.date) {
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
  }, [props.selectedPeriod, props.graphPeriod]);

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

  // This fixes a react-google-charts bug where the months are not fully shown
  // unless resized.
  const [calendarGraphW, setCalendarGraphW] = useState(0);
  useEffect(() => {
    setCalendarGraphW(5);
    setTimeout(() => setCalendarGraphW(0), 1);
  }, [props.graphPeriod, props.selectedPeriod]);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "80% 20%",
        alignItems: "start"
      }}
    >
      <div>
        <div
          className={styles.graphs}
          style={{ width: `calc(auto - ${calendarGraphW}px)` }}
        >
          {props.graphPeriod === "days" ? (
            graphMaker(
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
          ) : props.graphPeriod === "months" ? (
            graphMaker(
              `Year: ${props.selectedPeriod.year}`,
              yearGraphData,
              12,
              null
            )
          ) : props.graphPeriod === "hours" ? (
            graphMaker(
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
          ) : yearDayGraphData !== null ? (
            <div
              className={styles.calGraphs}
              style={{ width: `calc(auto - ${calendarGraphW}px)` }}
            >
              {calendarGraphMaker(`Revenue`, yearDayGraphData[0])}
              {calendarGraphMaker(`Number of Sessions`, yearDayGraphData[1])}
            </div>
          ) : (
            "Loading"
          )}
        </div>
        <div
          style={{
            display: "grid",
            gridColumnGap: "0.5em",
            gridTemplateColumns: "auto 1fr 1fr 30%"
          }}
        >
          <div>
            <span>Year</span>
            <NumberInput
              value={props.selectedPeriod.year}
              onChange={year => {
                props.setSelectedTime({ year, month: null, date: null });
                props.setGraphTime("months");
              }}
            />
          </div>
          <Button onClick={() => props.setGraphTime("months")}>
            Show Per Month Stats
          </Button>
          <Button onClick={() => props.setGraphTime("yearDays")}>
            Show Per Day Stats
          </Button>
        </div>
        <div className={styles.periodSelection}>
          <div>
            <h2>Month</h2>
            {!!yearData ? (
              <StatsTable
                columns={monthsColumns}
                shouldBeHighlighted={() => false}
                data={yearData.yearStats.monthly}
              />
            ) : null}
          </div>
          <div>
            <div>
              <h2 style={{ display: "inline-block" }}>Day</h2>
            </div>
            {!!monthData &&
            monthData.monthStats.year === props.selectedPeriod.year ? (
              <StatsTable
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

      <div>
        <LiveStats />
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
      useLazyQuery(STATS_PAGE.YEAR, { onCompleted }),
    useFetchYearDayStats: onCompleted =>
      useLazyQuery(STATS_PAGE.YEAR_DAY, { onCompleted })
  };
};

const connected = connect(mapStateToProps, mapDispatchToProps)(StatisticsPage);

export {
  connected as StatisticsPage,
  StatisticsPage as UnconnectedStatisticsPage
};
