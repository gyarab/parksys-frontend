import React, { useMemo } from "react";
import { stylesheet } from "typestyle";
import { Color } from "../constants";
import { Chart } from "react-charts";

interface IProps {
  day: string;
  data: any[] | null;
  unitKey: string;
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

function DayStatsChart({ inputData, unitKey }) {
  const hourlyData = useMemo(() => {
    const hourly = Array(24).fill({
      revenueCents: 0,
      numParkingSessions: 0
    });
    for (const elem of inputData) {
      const data = elem.data;
      const unit = elem[unitKey];
      hourly[unit] = {
        numParkingSessions: data.numParkingSessions,
        revenueCents: data.revenueCents / 100
      };
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
        width: "500px",
        height: "400px"
      }}
    >
      <Chart data={data} axes={axes} options={options} tooltip />
    </div>
  );
}

export const DayStatsDetails = (props: IProps) => {
  console.log(props);
  return (
    <div>
      <span>
        Selected day: <b>{props.day}</b>
      </span>
      <div className={styles.sections}>
        <Section title={"Per Hour"}>
          {!props.data ? (
            "Loading"
          ) : (
            <DayStatsChart inputData={props.data} unitKey={props.unitKey} />
          )}
        </Section>
      </div>
    </div>
  );
};
