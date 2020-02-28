import React from "react";
import { stylesheet } from "typestyle";
import moment from "moment";
import { ParkingRuleAssignment } from "./ParkingRuleAssignment";
import { calculateLeftRightFromTime } from "./ParkingRuleAssignmentDay";
import { Color } from "../../constants";
import { Dispatch } from "redux";
import {
  SET_SELECTED_DAY,
  ChangeOpenedNewRuleAssignment,
  CHANGE_OPENED_NEW_RULE_ASSIGNMENT
} from "../../redux/modules/rulePageActionCreators";
import { connect } from "react-redux";
import { ParkingRuleAssignmentDetails } from "./ParkingRuleAssignmentDetails";
import { IRulePageState } from "../../redux/modules/rulePageModule";
import { IStore } from "../../redux/IStore";
import { CloseAction } from "./CloseAction";

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

export interface IStateToProps {
  openedNewRuleAssignment?: IRulePageState["openedRuleAssignment"]["new"];
}

export interface IDispatchToProps {
  setSelectedDay: (newDay: string) => void;
  setOpenedNewRuleAssignment: (
    payload: ChangeOpenedNewRuleAssignment["payload"]
  ) => void;
}

export interface IProps extends IStateToProps, IDispatchToProps {
  assignments: any[];
  maxPriority: number;
  priority: number;
  dayStart: Date;
  onNewOrDel: () => void;
}

const addPRAStyles = stylesheet({
  plus: {
    position: "absolute",
    top: "50%",
    transform: "translate(-50%, -50%)",
    left: "50%",
    display: "none",
    fontWeight: "bold",
    textAlign: "center",
    color: "#666"
  },
  addPra: {
    width: "100%",
    height: "100%",
    position: "relative"
  },
  plusContainer: {
    width: "100%",
    height: "100%",
    $nest: {
      "&:hover > div": {
        display: "block"
      }
    }
  },
  children: {
    position: "relative",
    top: "-100%"
  }
});

const AddPRA = (props): JSX.Element => {
  return (
    <div className={addPRAStyles.addPra}>
      <div
        className={addPRAStyles.plusContainer}
        onClick={() => props.add(props.index)}
      >
        <div className={addPRAStyles.plus}>+</div>
      </div>
      <div className={addPRAStyles.children}>{props.children}</div>
    </div>
  );
};

const ParkingRuleAssignmentRow = ({
  assignments,
  maxPriority,
  priority,
  dayStart,
  setSelectedDay,
  setOpenedNewRuleAssignment,
  openedNewRuleAssignment,
  onNewOrDel
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
  const onAdd = (index: number) => {
    setOpenedNewRuleAssignment({
      priority,
      index
    });
  };

  const mightBeOpened =
    !!openedNewRuleAssignment && priority === openedNewRuleAssignment.priority;
  const backgroundMarkers = new Array(24).fill(0).map((_, i) => {
    const left = `${i * hourWidth}%`;
    let details = null;
    if (mightBeOpened && openedNewRuleAssignment.index === i) {
      const start = new Date(dayStart.getTime() + i * 3600 * 1000);
      const end = new Date(start.getTime() + 3600 * 1000); // +1 hour
      details = (
        <div
          style={{
            position: "relative",
            zIndex: maxPriority + 3
          }}
        >
          <ParkingRuleAssignmentDetails
            isNew={true}
            assignment={{
              start,
              end,
              priority: Math.max(1, priority),
              vehicleFilterMode: "ALL",
              vehicleFilters: [],
              rules: [],
              active: false
            }}
            close={action => {
              setOpenedNewRuleAssignment(null);
              if (
                action === CloseAction.DELETE ||
                action === CloseAction.SAVE
              ) {
                onNewOrDel();
              }
            }}
          />
        </div>
      );
    }
    return (
      <div className={classNames.horizontalUnit} style={{ left }}>
        <AddPRA add={onAdd} index={i}>
          {details}
        </AddPRA>
      </div>
    );
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

    const borderColor = assignment.active ? Color.AQUAMARINE : Color.LIGHT_GREY;
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
              borderRight: `${h}em solid ${borderColor}`,
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
              borderLeft: `${h}em solid ${borderColor}`,
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
            zIndex: priority + 1
          }}
        >
          <ParkingRuleAssignment
            assignment={assignment}
            onNewOrDel={onNewOrDel}
          />
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

const mapStateToProps = (state: Pick<IStore, "rulePage">): IStateToProps => {
  return {
    openedNewRuleAssignment: state.rulePage.openedRuleAssignment.new
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchToProps => {
  return {
    setSelectedDay: newDay =>
      dispatch({ type: SET_SELECTED_DAY, payload: { day: newDay } }),
    setOpenedNewRuleAssignment: payload =>
      dispatch({ type: CHANGE_OPENED_NEW_RULE_ASSIGNMENT, payload })
  };
};

const connected = connect(
  mapStateToProps,
  mapDispatchToProps
)(ParkingRuleAssignmentRow);

export {
  connected as ParkingRuleAssignmentRow,
  ParkingRuleAssignmentRow as UnconnectedParkingRuleAssignmentRow
};
