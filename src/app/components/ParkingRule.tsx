import { FlagType, Flag } from "./Flag";
import React from "react";

export const ParkingRule = ({ model }) => (
  <div>
    <Flag
      type={FlagType.NONE}
      text={model.__typename.replace("ParkingRule", "")}
    />
    {model.name}
  </div>
);
