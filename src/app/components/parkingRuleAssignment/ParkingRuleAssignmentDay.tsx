import React, { useState, useEffect } from "react";
import { stylesheet } from "typestyle";
import moment from "moment";
import { ParkingRuleAssignmentRow } from "./ParkingRuleAssignmentRow";
import { Color } from "../../constants/Color";

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
  calBody: {
    position: "relative"
  },
  timeIndicator: {
    position: "absolute",
    borderRight: `3px solid ${Color.BLUE}`,
    width: 0,
    top: 0
  },
  appliedRuleAssignment: {
    position: "absolute",
    borderTop: `4px solid ${Color.LIGHT_RED}`,
    height: 0
  },
  appliedRuleAssignmentConnector: {
    position: "absolute"
  }
});

export const millisToHours = millis => millis / (1000 * 3600);
// Result's unit is percent
export const calculateLeftRightFromTime = (
  boundLeft: Date,
  boundRight: Date,
  start: Date,
  end: Date
): [number, number] => {
  const diffStart = start.getTime() - boundLeft.getTime();
  const diffEnd = boundRight.getTime() - end.getTime();
  return [
    hourWidth * Math.max(0, millisToHours(diffStart)),
    hourWidth * Math.max(0, millisToHours(diffEnd))
  ];
};

const calcMaxPriority = data =>
  data.reduce((prevMax, assignment) => {
    return Math.max(assignment.priority, prevMax);
  }, -1);

export const ParkingRuleAssignmentDay = ({
  appliedData,
  data,
  day,
  onNewOrDel
}) => {
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

        const leftP = `${left}%`;
        const rightP = `${right}%`;
        const height = (appliedAssignment.assignment.priority + 1) * 2.9;
        const heightP = `calc(${height}em - 3px)`;
        return (
          <div
            key={i}
            className={classNames.appliedRuleAssignment}
            style={{
              left: leftP,
              right: rightP,
              bottom: heightP
            }}
          ></div>
        );
      })
    : [];

  const calculateTimeIndicatorPosition = () => {
    return hourWidth * millisToHours(new Date().getTime() - dayStart.getTime());
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
                priority={maxPriority - priority + 1}
                dayStart={dayStart}
                onNewOrDel={onNewOrDel}
              />
            </React.Fragment>
          ))}
          {appliedLines}
          <div
            className={classNames.timeIndicator}
            style={{
              left: `${Math.max(0, Math.min(100, timeIndicatorPosition))}%`,
              height: `${2.9 * rowCount}em`,
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
