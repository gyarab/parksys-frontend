import React, { useState, useEffect } from "react";
import { stylesheet } from "typestyle";
import moment from "moment";
import { ParkingRuleAssignment } from "./ParkingRuleAssignment";

const border = (width = "1px") => `${width} solid #c3c3c3`;
const hourWidth = 100 / 24;

const classNames = stylesheet({
  cal: {
    backgroundColor: "#f6f6f6",
    padding: "0.5em"
  },
  calCentered: {
    width: "97%",
    marginLeft: "auto",
    marginRight: "auto"
  },
  row: {
    position: "relative",
    height: "2.9em",
    top: 0,
    width: `${hourWidth * 24}%`,
    borderBottom: border("2px"),
    borderRight: border("2px"),
    borderLeft: border("2px"),
    $nest: {
      "&:first-child": {
        borderTop: border("2px")
      }
    }
  },
  calHeader: {
    position: "relative",
    height: "1.2em",
    $nest: {
      div: {
        position: "absolute",
        width: `${hourWidth}%`,
        height: "100%"
      }
    }
  },
  cellContainer: {
    position: "absolute",
    top: "0.2em",
    height: "2.5em"
  },
  horizontalUnit: {
    width: `${hourWidth}%`,
    borderRight: border(),
    position: "absolute",
    top: 0,
    height: "100%",
    $nest: {
      "&:last-child": {
        borderRight: 0
      }
    }
  },
  calBody: {
    position: "relative"
  },
  timeIndicator: {
    position: "absolute",
    borderRight: "2px solid red",
    width: 0,
    top: 0
  }
});

const toHours = millis => millis / (1000 * 3600);

const ParkingRuleAssignmentRow = ({
  assignments,
  maxPriority,
  priority,
  dayStart
}) => {
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

    const diffStart = start.getTime() - dayStart.getTime();
    const diffEnd = dayEnd.getTime() - end.getTime();
    let left = hourWidth * Math.max(0, toHours(diffStart));
    let right = hourWidth * Math.max(0, toHours(diffEnd));

    return (
      <div
        className={classNames.cellContainer}
        style={{
          left: `${left}%`,
          right: `${right}%`,
          zIndex: maxPriority - priority + 1
        }}
      >
        <ParkingRuleAssignment assignment={assignment} />
      </div>
    );
  });
  return (
    <div className={classNames.row}>
      {assignmentsElements}
      {backgroundMarkers}
    </div>
  );
};

const calcMaxPriority = data =>
  data.reduce((prevMax, assignment) => {
    return Math.max(assignment.priority, prevMax);
  }, -1);

export const ParkingRuleAssignmentDay = ({ data, day }) => {
  const dayStart = moment(day)
    .startOf("day")
    .toDate();
  const maxPriority = calcMaxPriority(data);
  const priorityAssignmentMap = new Array(maxPriority + 1);
  for (let i = 0; i < maxPriority + 1; i++) {
    priorityAssignmentMap[i] = [];
  }
  for (const assignment of data) {
    const key = assignment.priority;
    priorityAssignmentMap[key].push(assignment);
  }

  const timeMarkers = new Array(24).fill(0).map((_, i) => {
    const left = `${i * hourWidth}%`;
    return <div style={{ left }}>{i}h</div>;
  });

  const calculateTimeIndicatorPosition = () => {
    return hourWidth * toHours(new Date().getTime() - dayStart.getTime());
  };
  const [timeIndicatorPosition, setTimeIndicatorPosition] = useState(
    calculateTimeIndicatorPosition()
  );
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeIndicatorPosition(calculateTimeIndicatorPosition());
    }, 30000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className={classNames.cal}>
      <div className={classNames.calCentered}>
        <div className={classNames.calHeader}>{timeMarkers}</div>
        <div className={classNames.calBody}>
          {priorityAssignmentMap.map((assignments, priority) => (
            <React.Fragment key={priority}>
              <ParkingRuleAssignmentRow
                assignments={assignments}
                maxPriority={maxPriority}
                priority={priority}
                dayStart={dayStart}
              />
            </React.Fragment>
          ))}
          <div
            className={classNames.timeIndicator}
            style={{
              left: `${timeIndicatorPosition}%`,
              height: `${2.9 * (maxPriority + 1)}em`,
              zIndex: maxPriority + 1
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};
