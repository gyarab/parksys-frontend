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
  },
  appliedRuleAssignment: {
    position: "absolute",
    borderTop: "3px solid blue"
  }
});

const toHours = millis => millis / (1000 * 3600);
// Result's unit is percent
const calculateLeftRightFromTime = (
  boundLeft: Date,
  boundRight: Date,
  start: Date,
  end: Date
): [number, number] => {
  const diffStart = start.getTime() - boundLeft.getTime();
  const diffEnd = boundRight.getTime() - end.getTime();
  return [
    hourWidth * Math.max(0, toHours(diffStart)),
    hourWidth * Math.max(0, toHours(diffEnd))
  ];
};

const ParkingRuleAssignmentRow = ({
  assignments,
  maxPriority,
  priority,
  dayStart
}) => {
  const dayEnd = moment(dayStart)
    .endOf("day")
    .toDate();
  const backgroundMarkers = new Array(24).fill(0).map((_, i) => {
    const left = `${i * hourWidth}%`;
    return <div className={classNames.horizontalUnit} style={{ left }}></div>;
  });
  const assignmentsElements = assignments.map(assignment => {
    const start = new Date(assignment.start);
    const end = new Date(assignment.end);
    const [left, right] = calculateLeftRightFromTime(
      dayStart,
      dayEnd,
      start,
      end
    );
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

export const ParkingRuleAssignmentDay = ({ appliedData, data, day }) => {
  const dayStartM = moment(day).startOf("day");
  const dayStart = dayStartM.toDate();
  const dayEnd = dayStartM.endOf("day").toDate();

  const maxPriority = calcMaxPriority(data);
  const rowCount = maxPriority + 2; // Extra row at the top and bottom
  const priorityAssignmentMap = new Array(rowCount);
  for (let i = 0; i < priorityAssignmentMap.length; i++) {
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

  const appliedLines = !!appliedData
    ? appliedData.map((appliedAssignment, i) => {
        const start = new Date(appliedAssignment.start);
        const end = new Date(appliedAssignment.end);
        const [left, right] = calculateLeftRightFromTime(
          dayStart,
          dayEnd,
          start,
          end
        );
        const height = (1 + appliedAssignment.assignment.priority) * 2.9;
        return (
          <div
            key={i}
            className={classNames.appliedRuleAssignment}
            style={{
              left: `${left}%`,
              right: `${right}%`,
              bottom: `calc(${height}em - 3px)`
            }}
          ></div>
        );
      })
    : [];

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
    setTimeIndicatorPosition(calculateTimeIndicatorPosition());
    return () => {
      clearInterval(timer);
    };
  }, [day]);

  return (
    <div className={classNames.cal}>
      <div className={classNames.calCentered}>
        <div className={classNames.calHeader}>{timeMarkers}</div>
        <div className={classNames.calBody}>
          {priorityAssignmentMap.reverse().map((assignments, priority) => (
            <React.Fragment key={priority}>
              <ParkingRuleAssignmentRow
                assignments={assignments}
                maxPriority={maxPriority}
                priority={priority}
                dayStart={dayStart}
              />
            </React.Fragment>
          ))}
          {appliedLines}
          <div
            className={classNames.timeIndicator}
            style={{
              left: `${Math.max(0, Math.min(100, timeIndicatorPosition))}%`,
              height: `${2.9 * rowCount}em`,
              zIndex: rowCount,
              visibility:
                0 <= timeIndicatorPosition && timeIndicatorPosition <= 100
                  ? "inherit"
                  : "hidden"
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};
