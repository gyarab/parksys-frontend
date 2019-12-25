import React from "react";
import { stylesheet } from "typestyle";
import moment from "moment";
import { ParkingRuleAssignment } from "./ParkingRuleAssignment";
import { calculateLeftRightFromTime } from "./ParkingRuleAssignmentDay";
import { Color } from "../constants";
import { Dispatch } from "redux";
import { SET_SELECTED_DAY } from "../redux/modules/rulePageActionCreators";
import { connect } from "react-redux";

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
  continuationTriangle: {
    height: 0,
    width: 0,
    position: "absolute",
    cursor: "pointer"
  }
});

export interface IDispatchToProps {
  setSelectedDay: (newDay: string) => any;
}

export interface IProps extends IDispatchToProps {
  assignments: any[];
  maxPriority: number;
  priority: number;
  dayStart: Date;
}

const ParkingRuleAssignmentRow = ({
  assignments,
  maxPriority,
  priority,
  dayStart,
  setSelectedDay
}: IProps) => {
  const dayEnd = moment(dayStart)
    .endOf("day")
    .toDate();
  // TODO: Is this actually legit?
  const middle = new Date((dayStart.getTime() + dayEnd.getTime()) / 2);
  const previousDay = moment(middle)
    .subtract(1, "day")
    .toDate()
    .toISOString()
    .slice(0, 10);
  const nextDay = moment(middle)
    .add(1, "day")
    .toDate()
    .toISOString()
    .slice(0, 10);
  const backgroundMarkers = new Array(24).fill(0).map((_, i) => {
    const left = `${i * hourWidth}%`;
    return <div className={classNames.horizontalUnit} style={{ left }}></div>;
  });
  const assignmentsElements = assignments.map((assignment, i) => {
    const start = new Date(assignment.start);
    const end = new Date(assignment.end);
    const [left, right] = calculateLeftRightFromTime(
      dayStart,
      dayEnd,
      start,
      end
    );
    const continueLeft = start.getTime() < dayStart.getTime();
    const continueRight = end.getTime() > dayEnd.getTime();
    const p = -2.9 / 2 + 0.3;
    const top = 0.2;
    const h = 2.9 / 2 - top;
    return (
      <React.Fragment key={i}>
        {continueLeft ? (
          <div
            title="Previous day"
            onClick={() => setSelectedDay(previousDay)}
            className={classNames.continuationTriangle}
            style={{
              borderTop: `${h}em solid transparent`,
              borderBottom: `${h}em solid transparent`,
              borderRight: `${h}em solid ${Color.AQUAMARINE}`,
              top: `${top}em`,
              left: `${p}em`
            }}
          ></div>
        ) : null}
        {continueRight ? (
          <div
            title="Next day"
            onClick={() => setSelectedDay(nextDay)}
            className={classNames.continuationTriangle}
            style={{
              borderTop: `${h}em solid transparent`,
              borderBottom: `${h}em solid transparent`,
              borderLeft: `${h}em solid ${Color.AQUAMARINE}`,
              top: `${top}em`,
              right: `${p}em`,
              position: "absolute"
            }}
          ></div>
        ) : null}
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
      </React.Fragment>
    );
  });
  return (
    <div className={classNames.row}>
      {assignmentsElements}
      {backgroundMarkers}
    </div>
  );
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchToProps => {
  return {
    setSelectedDay: newDay =>
      dispatch({ type: SET_SELECTED_DAY, payload: { day: newDay } })
  };
};

const connected = connect(null, mapDispatchToProps)(ParkingRuleAssignmentRow);

export {
  connected as ParkingRuleAssignmentRow,
  ParkingRuleAssignmentRow as UnconnectedParkingRuleAssignmentRow
};
