import React, { useMemo, useState } from "react";
import moment from "moment";
import { stylesheet } from "typestyle";
import { Color } from "../../constants";

interface IProps {
  date: string;
  setSelectedDay: (day) => void;
  data: any;
}

const h = "5em";
const Cell = ({
  children,
  onClick
}: {
  children?: any;
  onClick?: () => void;
}) => (
  <div
    style={{
      border: "1px solid #ccc",
      width: h,
      cursor: !onClick ? "default" : "pointer"
    }}
    onClick={() => (!onClick ? null : onClick())}
  >
    {children}
  </div>
);

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
  }
});

const ParkingAssignmentCalendarCell = ({
  dayStart,
  dayEnd,
  assignments,
  highlighted,
  setHighlighted
}) => {
  return (
    <>
      {assignments.map(assignment => {
        const color = (() => {
          if (assignment.id === highlighted) {
            return "red";
          } else if (assignment.active) {
            return "black";
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
            style={{
              borderTop: `7px solid ${color}`,
              marginBottom: "3px",
              marginLeft: `calc(${(100 * left) / max}%)`,
              marginRight: `calc(${(100 * right) / max}%)`
            }}
            onMouseOver={() => setHighlighted(assignment.id)}
            onMouseLeave={() => setHighlighted(null)}
          ></div>
        );
      })}
    </>
  );
};

export const ParkingRuleAssignmentMonth = (props: IProps) => {
  console.log(props.data);
  const date = moment(props.date);
  const monthStart = moment(props.date).startOf("month");
  const end = moment(props.date).endOf("month");
  const [highlighted, setHighlighted] = useState(null);

  // Sort by active (first) and by length
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
        .sort((a, b) => {
          if (a._length - b._length < 0) return 1;
          if (a._length - b._length > 0) return -1;
          if (a.active && !b.active) return -1;
          if (!a.active && b.active) return 1;
          return 0;
        }),
    [props.data]
  );

  const startOffset = weekdayToOffsetStart[monthStart.weekday()];
  const endOffset = weekdayToOffsetEnd[end.weekday()];
  const daysInMonth = date.daysInMonth();
  return (
    <div className={styles.calendarDisplay}>
      <div className={styles.header}>
        {days.map((day, i) => (
          <div style={{ position: "absolute", left: `calc((100%/7)*${i})` }}>
            {day.slice(0, 3)}
          </div>
        ))}
      </div>
      <div className={styles.calendar}>
        {new Array(daysInMonth + startOffset + endOffset)
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
            return (
              <Cell onClick={onClick}>
                <span
                  style={{
                    color: Color.GREY,
                    width: "100%",
                    margin: "auto",
                    opacity: isOtherMonth ? 0.3 : 1,
                    fontWeight: 900
                  }}
                >
                  {dayStart.getDate()}
                </span>
                <ParkingAssignmentCalendarCell
                  dayStart={dayStart}
                  dayEnd={dayEnd}
                  assignments={assignments}
                  highlighted={highlighted}
                  setHighlighted={setHighlighted}
                />
              </Cell>
            );
          })}
      </div>
    </div>
  );
};
