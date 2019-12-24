import React from "react";
import { stylesheet } from "typestyle";
import moment from "moment";

const border = (width = "1px") => `${width} solid #c3c3c3`;

const classNames = stylesheet({
  cal: {
    backgroundColor: "#f6f6f6",
    padding: "0.5em 1em 0.5em 1em"
  },
  row: {
    position: "relative",
    height: "2em",
    top: 0,
    borderBottom: border("2px"),
    borderRight: border("2px"),
    borderLeft: border("2px"),
    $nest: {
      "&:first-child": {
        borderTop: border("2px")
      }
    }
  },
  cell: {
    position: "absolute",
    top: 0,
    height: "100%",
    backgroundColor: "blue"
  },
  horizontalUnit: {
    width: "4%",
    borderRight: border(),
    position: "absolute",
    top: 0,
    height: "100%"
  }
});

const ParkingRuleAssignmentRow = ({ assignments, priority, dayStart }) => {
  const hourWidth = 4;
  const dayEnd = moment(dayStart)
    .endOf("day")
    .toDate();
  console.log(assignments, priority);
  const backgroundMarkers = new Array(24).fill(0).map((_, i) => {
    const left = `${i * hourWidth}%`;
    return <div className={classNames.horizontalUnit} style={{ left }}></div>;
  });
  const assignmentsElements = assignments.map(assignment => {
    const start = new Date(assignment.start);
    const end = new Date(assignment.end);

    const toHours = millis => millis / (1000 * 3600);
    const diffStart = start.getTime() - dayStart.getTime();
    const diffEnd = dayEnd.getTime() - end.getTime();
    let left = hourWidth * Math.max(0, toHours(diffStart));
    let right = hourWidth * Math.max(0, toHours(diffEnd));

    return (
      <div
        className={classNames.cell}
        style={{
          left: `${left}%`,
          right: `${right}%`
        }}
      >
        <span style={{ fontFamily: "monospace" }}>{assignment.id}</span>
      </div>
    );
  });
  return (
    <div className={classNames.row}>
      {backgroundMarkers}
      {assignmentsElements}
    </div>
  );
};

const calcMaxPriority = data =>
  data.reduce((prevMax, assignment) => {
    return Math.max(assignment.priority, prevMax);
  }, -1);

export const ParkingRuleAssignmentDay = ({ data, day }) => {
  const maxPriority = calcMaxPriority(data);
  const priorityAssignmentMap = new Array(maxPriority + 1);
  for (let i = 0; i < maxPriority + 1; i++) {
    priorityAssignmentMap[i] = [];
  }
  console.log(priorityAssignmentMap);
  for (const assignment of data) {
    const key = assignment.priority;
    priorityAssignmentMap[key].push(assignment);
  }
  console.log(priorityAssignmentMap);
  return (
    <div className={classNames.cal}>
      {priorityAssignmentMap.map((assignments, priority) => (
        <React.Fragment key={priority}>
          <ParkingRuleAssignmentRow
            assignments={assignments}
            priority={priority}
            dayStart={moment(day)
              .startOf("day")
              .toDate()}
          />
        </React.Fragment>
      ))}
    </div>
  );
};
