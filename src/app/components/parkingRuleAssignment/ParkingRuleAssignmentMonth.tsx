import React, { useMemo, useState } from "react";
import moment from "moment";
import { stylesheet, classes } from "typestyle";
import { Color } from "../../constants";
import { ParkingRuleAssignmentDetails } from "./ParkingRuleAssignmentDetails";
import { IStore } from "../../redux/IStore";
import { IRulePageState } from "../../redux/modules/rulePageModule";
import {
  SetSelectedDay,
  SET_SELECTED_DAY
} from "../../redux/modules/rulePageActionCreators";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { CloseAction } from "./CloseAction";
import { ParkingRuleAssignmentCopyPanel } from "./ParkingRuleAssignmentCopyPanel";
import { Flag, FlagType } from "../Flag";
import { ParkingRuleAssignmentMultiDelete } from "./ParkingRuleAssignmentMultiDelete";

interface IStateToProps {
  selectedDays: IRulePageState["selectedDays"];
  daySelectorMode: IRulePageState["daySelectorMode"];
}

interface IDispatchToProps {
  setSelectedDays: (days: SetSelectedDay["payload"]) => void;
}

interface IProps extends IStateToProps, IDispatchToProps {
  date: string;
  setSelectedDay: (day) => void;
  setAssignment: (id: any) => void;
  assignment: any;
  data: any;
  onNewOrDel: () => void;
}

const h = "8.5em";

// 0 sunday
// 1 monday
// 2 tuesday
// 3 wednesday
// 4 thursday
// 5 friday
// 6 saturday
const weekdayToOffsetStart = [6, 0, 1, 2, 3, 4, 5];
const weekdayToOffsetEnd = [0, 6, 5, 4, 3, 2, 1];
var days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];

const styles = stylesheet({
  calendar: {
    display: "grid",
    gridTemplateColumns: `repeat(7, ${h})`,
    gridAutoRows: h
  },
  header: {
    position: "relative",
    height: "1.2em"
  },
  calendarDisplay: {
    width: `calc(7 * ${h})`,
    display: "grid",
    gridTemplateColumns: "1fr",
    gridTemplateRows: `auto auto`
  },
  monthDisplay: {
    display: "grid",
    gridTemplateRows: "1fr",
    gridTemplateColumns: "1fr 1fr",
    gridColumnGap: "1em"
  },
  calendarCell: {
    border: "1px solid #ccc",
    width: h,
    paddingTop: "0.3em",
    transition: "0.1s all ease-out"
  },
  hoverableCell: {
    $nest: {
      "&:hover": {
        boxShadow: "0 0 10px #999"
      }
    }
  },
  selectedCellExact: {
    boxShadow: `0 0 10px ${Color.ORANGE}`,
    borderColor: Color.ORANGE,
    $nest: {
      "&:hover": {
        boxShadow: `0 0 10px ${Color.ORANGE}`
      }
    }
  },
  selectedCellRange: {
    boxShadow: `0 0 10px ${Color.BLUE}`,
    borderColor: Color.BLUE,
    $nest: {
      "&:hover": {
        boxShadow: `0 0 10px ${Color.BLUE}`
      }
    }
  },
  sidePanel: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gridTemplateRows: "10fr 9fr",
    gridRowGap: "0.5em"
  }
});

const Cell = ({
  children,
  onClick,
  canBeHighlighted,
  selectMode
}: {
  children?: any;
  onClick?: () => void;
  canBeHighlighted: boolean;
  selectMode: CellSelectMode;
}) => {
  const selectedClass = ((): string | null => {
    switch (selectMode) {
      case "exact":
        return styles.selectedCellExact;
      case "range":
        return styles.selectedCellRange;
      default:
        return null;
    }
  })();
  return (
    <div
      className={classes(
        styles.calendarCell,
        canBeHighlighted ? styles.hoverableCell : null,
        selectedClass
      )}
      style={{
        cursor: !onClick ? "default" : "pointer"
      }}
      onClick={() => (!onClick ? null : onClick())}
    >
      {children}
    </div>
  );
};

const ParkingAssignmentCalendarCell = ({
  dayStart,
  dayEnd,
  assignments,
  highlighted,
  setHighlightedAssignment,
  setSelectedAssignment
}) => {
  return (
    <>
      {assignments.map(assignment => {
        const color = (() => {
          if (highlighted.includes(assignment.id)) {
            return Color.BLUE;
          } else if (assignment.active) {
            return Color.AQUAMARINE;
          } else {
            return Color.LIGHT_GREY;
          }
        })();
        const max = 24 * 3600 * 1000;
        const left = Math.max(
          0,
          assignment._start.getTime() - dayStart.getTime()
        );
        const right = Math.max(0, dayEnd.getTime() - assignment._end.getTime());
        return (
          <div
            key={assignment.id}
            style={{
              borderTop: `1em solid ${color}`,
              marginBottom: "3px",
              marginLeft: `calc(${(100 * left) / max}%)`,
              marginRight: `calc(${(100 * right) / max}%)`
            }}
            onMouseOver={e => {
              e.stopPropagation();
              setHighlightedAssignment(assignment.id);
            }}
            onMouseLeave={() => setHighlightedAssignment(null)}
            onClick={e => {
              e.stopPropagation();
              setSelectedAssignment(assignment.id);
            }}
          ></div>
        );
      })}
    </>
  );
};

const cellSelectorStyles = stylesheet({
  cellSelector: {
    border: `2px solid ${Color.LIGHT_GREY}`,
    borderRadius: "2px",
    marginRight: "0.3em",
    float: "right",
    width: "1.2em",
    height: "1.2em",
    transition: "0.2s all ease-out",
    $nest: {
      "&:hover": {
        border: `3px solid ${Color.BLUE}`
      }
    }
  },
  selectedCellSelectorExact: {
    borderColor: Color.ORANGE,
    backgroundColor: Color.ORANGE,
    $nest: {
      "&:hover": {
        border: `3px solid ${Color.LIGHT_RED}`,
        backgroundColor: "transparent"
      }
    }
  },
  // Don't change appearance on hover
  selectedCellSelectorRange: {
    borderColor: Color.BLUE,
    backgroundColor: Color.BLUE,
    $nest: {
      "&:hover": {
        border: `3px solid ${Color.BLUE}`,
        backgroundColor: Color.BLUE
      }
    }
  }
});

const CellSelector = ({ dayStart, dayEnd, selectMode, select }) => {
  const selectedClass = ((): string | null => {
    switch (selectMode) {
      case "exact":
        return cellSelectorStyles.selectedCellSelectorExact;
      case "range":
        return cellSelectorStyles.selectedCellSelectorRange;
      default:
        return null;
    }
  })();
  return (
    <div
      className={classes(cellSelectorStyles.cellSelector, selectedClass)}
      onClick={e => {
        e.stopPropagation();
        select([dayStart, dayEnd]);
      }}
    ></div>
  );
};

type CellSelectMode = "exact" | "range" | "none";

const isCellSelected = (
  start: Date,
  end: Date,
  selectorMode: IProps["daySelectorMode"],
  selectedDays: IProps["selectedDays"]
): CellSelectMode => {
  if (selectedDays[start.getTime()] === end.getTime()) {
    return "exact";
  }
  if (selectorMode == "continuous") {
    let min: number = Number.POSITIVE_INFINITY;
    let max: number = Number.NEGATIVE_INFINITY;
    // O(2)
    Object.keys(selectedDays).forEach(sStart => {
      const sEnd = selectedDays[sStart];
      min = Math.min(Number(sStart), min);
      max = Math.max(sEnd, max);
    });
    if (min <= start.getTime() && end.getTime() <= max) {
      return "range";
    }
  }
  return "none";
};

const ParkingRuleAssignmentMonth = (props: IProps) => {
  const date = moment(props.date);
  const monthStart = moment(props.date).startOf("month");
  const end = moment(props.date).endOf("month");
  const [highlighted, setHighlighted] = useState(null);

  // Sort by length
  const sortedAssignments = useMemo(
    () =>
      props.data
        .map(assignment => {
          const start = new Date(assignment.start);
          const end = new Date(assignment.end);
          return {
            ...assignment,
            _start: start,
            _end: end,
            _length: end.getTime() - start.getTime()
          };
        })
        .sort((a, b) => b._length - a._length),
    [props.data]
  );

  const startOffset = weekdayToOffsetStart[monthStart.weekday()];
  const endOffset = weekdayToOffsetEnd[end.weekday()];
  const daysInMonth = date.daysInMonth();
  const now = new Date();
  const renderedCells = new Array(daysInMonth + startOffset + endOffset)
    .fill(0)
    .map((_, i) => {
      const dayStartM = monthStart
        .clone()
        .add(i - startOffset, "days")
        .startOf("day");
      const dayEnd = dayStartM
        .clone()
        .endOf("day")
        .toDate();
      const dayStart: Date = dayStartM.toDate();
      const onClick = () => {
        props.setSelectedDay(
          monthStart
            .clone()
            .add(i - startOffset + 1, "days")
            .toDate()
            .toISOString()
            .slice(0, 10)
        );
      };
      const assignments = sortedAssignments.filter(
        ({ _start, _end }) =>
          _start.getTime() <= dayEnd.getTime() &&
          _end.getTime() >= dayStart.getTime()
      );
      const isPrevMonth = i < startOffset;
      const isNextMonth = i >= daysInMonth + startOffset;
      const isOtherMonth = isPrevMonth || isNextMonth;
      const selectMode = isCellSelected(
        dayStart,
        dayEnd,
        props.daySelectorMode,
        props.selectedDays
      );
      const isToday =
        dayStart.getTime() <= now.getTime() &&
        now.getTime() <= dayEnd.getTime();
      return (
        <Cell
          key={dayStart.toISOString()}
          onClick={onClick}
          canBeHighlighted={highlighted === null}
          selectMode={selectMode}
        >
          <div style={{ marginBottom: "0.2em" }}>
            <span
              style={{
                color: Color.GREY,
                width: "100%",
                margin: "auto",
                opacity: isOtherMonth ? 0.3 : 1,
                fontWeight: 900,
                marginLeft: "0.2em",
                borderRadius: "1em",
                padding: "0.2em",
                backgroundColor: isToday ? Color.LIGHT_BLUE : null
              }}
            >
              {dayStart.getDate()}
            </span>
            {selectMode === "none" &&
            props.daySelectorMode === "continuous" &&
            Object.keys(props.selectedDays).length === 2 ? null : (
              <CellSelector
                dayStart={dayStart}
                dayEnd={dayEnd}
                select={props.setSelectedDays}
                selectMode={selectMode}
              />
            )}
          </div>
          <ParkingAssignmentCalendarCell
            dayStart={dayStart}
            dayEnd={dayEnd}
            assignments={assignments}
            highlighted={[highlighted, props.assignment.id]}
            setHighlightedAssignment={setHighlighted}
            setSelectedAssignment={props.setAssignment}
          />
        </Cell>
      );
    });
  return (
    <div className={styles.monthDisplay}>
      <div className={styles.calendarDisplay}>
        <div className={styles.header}>
          {days.map((day, i) => (
            <div style={{ position: "absolute", left: `calc((100%/7)*${i})` }}>
              {day.slice(0, 3)}
            </div>
          ))}
        </div>
        <div className={styles.calendar}>{renderedCells}</div>
      </div>
      <div className={styles.sidePanel}>
        <div style={{ position: "relative", height: "100%" }}>
          {!props.assignment ||
          !props.assignment.id ||
          !props.data ||
          props.data.length === 0 ? (
            <div style={{ marginTop: "2em" }}>
              <Flag text={"Select a Rule Assignment"} type={FlagType.WARNING} />
            </div>
          ) : (
            <ParkingRuleAssignmentDetails
              key={props.assignment.id}
              assignment={props.data.find(
                assignment => assignment.id === props.assignment.id
              )}
              close={action => {
                props.setAssignment(null);
                if (
                  action === CloseAction.DELETE ||
                  action === CloseAction.SAVE
                ) {
                  props.onNewOrDel();
                }
              }}
            />
          )}
        </div>
        <div>
          <h3>Quick Actions</h3>
          <ParkingRuleAssignmentCopyPanel refetch={props.onNewOrDel} />
          <ParkingRuleAssignmentMultiDelete refetch={props.onNewOrDel} />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: Pick<IStore, "rulePage">): IStateToProps => {
  return {
    selectedDays: state.rulePage.selectedDays,
    daySelectorMode: state.rulePage.daySelectorMode
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchToProps => {
  return {
    setSelectedDays: days => dispatch({ type: SET_SELECTED_DAY, payload: days })
  };
};

const connected = connect(
  mapStateToProps,
  mapDispatchToProps
)(ParkingRuleAssignmentMonth);

export {
  connected as ParkingRuleAssignmentMonth,
  ParkingRuleAssignmentMonth as UnconnectedParkingRuleAssignmentMonth
};
