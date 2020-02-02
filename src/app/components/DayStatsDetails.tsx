import React, { useMemo } from "react";
import { stylesheet } from "typestyle";
import { Color } from "../constants";
import { Chart } from "react-charts";

interface IProps {
  day: string;
  data: any[] | null;
}

const styles = stylesheet({
  sections: {
    display: "flex"
  },
  section: {
    border: `1px solid ${Color.LIGHT_GREY}`,
    marginTop: "1em",
    padding: "0.5em",
    borderRadius: "3px",
    minWidth: "20em",
    minHeight: "15em",
    $nest: {
      "> h3": {
        margin: "8px 0 14px 0"
      }
    }
  }
});

const Section = ({ title, children }) => {
  return (
    <div className={styles.section}>
      <h3>{title}</h3>
      <div>{children}</div>
    </div>
  );
};

function DayStatsChart({ inputData }) {
  const hourlyData = useMemo(() => {
    const hourly = Array(24).fill({
      revenueCents: 0,
      numParkingSessions: 0
    });
    for (const { hour, data } of inputData) {
      hourly[hour] = data;
    }
    return hourly;
  }, [inputData]);

  const data = useMemo(() => {
    const revenueData = hourlyData.map((p, i) => [i, p.revenueCents]);
    const sessionsData = hourlyData.map((p, i) => [i, p.numParkingSessions]);
    return [
      {
        label: "Revenue",
        secondaryAxisID: "Revenue",
        data: revenueData
      },
      {
        label: "# of Sessions",
        secondaryAxisID: "# of Sessions",
        data: sessionsData
      }
    ];
  }, [hourlyData]);

  const axes = useMemo(
    () => [
      { primary: true, type: "linear", position: "bottom" },
      { type: "linear", position: "left", id: "Revenue" },
      { type: "linear", position: "right", id: "# of Sessions" }
    ],
    []
  );

  const options = useMemo(
    () => ({
      title: {
        text: "Hourly Stats"
      },
      axisX: {
        title: "Hours",
        reversed: true
      }
    }),
    []
  );

  return (
    <div
      style={{
        width: "400px",
        height: "300px"
      }}
    >
      <Chart data={data} axes={axes} options={options} tooltip />
    </div>
  );
}

export const DayStatsDetails = (props: IProps) => {
  return (
    <div>
      <span>
        Selected day: <b>{props.day}</b>
      </span>
      <div className={styles.sections}>
        <Section title={"Per Hour"}>
          {!props.data ? "Loading" : <DayStatsChart inputData={props.data} />}
        </Section>
      </div>
    </div>
  );
};
