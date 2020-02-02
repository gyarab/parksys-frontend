import React from "react";

interface IProps {
  day: string;
}

export const DayStatsDetails = (props: IProps) => {
  return (
    <span>
      Selected day: <b>{props.day}</b>
    </span>
  );
};
