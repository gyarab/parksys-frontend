import {
  RulePageActionTypes,
  CHANGE_OPENED_RULE_ASSIGNMENT,
  SET_QUERY_VARS,
  SET_COLLIDING_RULE_ASSIGNMENTS,
  CHANGE_SIMULATE_RULES_ASSIGNMENTS_OPTIONS,
  CHANGE_OPENED_NEW_RULE_ASSIGNMENT,
  SET_VEHICLE_FILTER,
  SET_PARKING_RULE,
  SET_SELECTED_DAY,
  SetSelectedDay,
  SET_DAY_SELECTOR_MODE,
  SET_DAY_TYPE_BEING_SELECTED,
  SetDayTypeBeingSelected,
  CLEAR_TARGET_DAYS,
  CLEAR_SELECTED_DAYS,
  SET_MAX_TARGET_DAYS,
  SET_ERROR
} from "./rulePageActionCreators";
import moment = require("moment");

export interface IRulePageStateSimulation {
  on: boolean;
  start: Date;
  end: Date;
  vehicle: {
    id: string;
    licensePlate?: string;
    numParkingSessions: number;
  };
}

type DayList = { [startTimestamp: number]: number };

export interface IRulePageState {
  queryVariables: {
    date: string;
    range: "day" | "month";
  };
  openedRuleAssignment: {
    id: string | null;
    new?: {
      priority: number;
      index: number;
    } | null;
  };
  collidingRuleAssignments: Set<string>;
  ruleAssignmentSimulation: IRulePageStateSimulation;
  selectedVehicleFilter?: {
    id: string;
    action: string;
    name: string;
    vehicles: string[];
  };
  selectedParkingRule?: {
    id: string;
    name: string;
    __typename: string;
    // PermitAccess
    permit?: boolean;
    // TimedFee
    centsPerUnitTime?: number;
    unitTime?: string;
  };
  sourceDays: DayList;
  daySelectorMode: "continuous" | "separate" | "none";
  dayTypeBeingSelected: "destination" | "source";
  destinationDays: DayList;
  maxDestinationDays: number;
  error: string | null;
}

const defaultSelectedDay = () => new Date().toISOString().slice(0, 10);
export const initialState: IRulePageState = {
  queryVariables: {
    date: defaultSelectedDay(),
    range: "month"
  },
  openedRuleAssignment: {
    id: null,
    new: null
  },
  collidingRuleAssignments: new Set(),
  ruleAssignmentSimulation: {
    on: false,
    start: moment()
      .subtract(3, "hour")
      .startOf("hour")
      .toDate(),
    end: moment()
      .add(1, "hour")
      .startOf("hour")
      .toDate(),
    vehicle: null
  },
  selectedVehicleFilter: null,
  selectedParkingRule: null,
  sourceDays: {},
  daySelectorMode: "continuous",
  destinationDays: {},
  maxDestinationDays: -1,
  dayTypeBeingSelected: "source",
  error: null
};

const sourceDaysMinMax = (
  selectedDays: IRulePageState["sourceDays"]
): [number, number] => {
  let min: number = Number.POSITIVE_INFINITY;
  let max: number = Number.NEGATIVE_INFINITY;
  // O(2)
  Object.keys(selectedDays).forEach(sStart => {
    const sEnd = selectedDays[sStart];
    min = Math.min(Number(sStart), min);
    max = Math.max(sEnd, max);
  });
  return [min, max];
};

const verifyNoDayIntersectionMM = (
  [min, max]: [number, number],
  dest: IRulePageState["destinationDays"]
): boolean => {
  return Object.keys(dest).some(start => {
    const end = dest[start];
    return min <= Number(start) && end <= max;
  });
};

const verifyNoDayIntersection = (
  src: IRulePageState["sourceDays"],
  dest: IRulePageState["destinationDays"]
): boolean => {
  return verifyNoDayIntersectionMM(sourceDaysMinMax(src), dest);
};

const theOtherHasIt = (
  action: SetSelectedDay,
  days: IRulePageState["destinationDays"] | IRulePageState["sourceDays"]
): boolean => {
  return days[action.payload[0].getTime()] === action.payload[1].getTime();
};

const setSourceDays = (
  state: IRulePageState,
  action: SetSelectedDay
): IRulePageState["sourceDays"] => {
  if (action.payload === null) {
    // Clear
    return initialState.sourceDays;
  }
  const [start, end] = action.payload;
  // Copy
  const selectedDays = { ...state.sourceDays };
  if (state.sourceDays[start.getTime()] === end.getTime()) {
    // Remove
    delete selectedDays[start.getTime()];
  } else if (
    state.daySelectorMode === "separate" ||
    (state.daySelectorMode === "continuous" &&
      Object.keys(selectedDays).length < 2)
  ) {
    selectedDays[start.getTime()] = end.getTime();
  }
  return selectedDays;
};

const setDestinationDays = (
  state: IRulePageState,
  action: SetSelectedDay
): [IRulePageState["destinationDays"], string] => {
  if (action.payload !== null) {
    const [start, end] = action.payload;
    const [min, max] = sourceDaysMinMax(state.sourceDays);
    if (min <= start.getTime() && end.getTime() <= max) {
      return [state.destinationDays, "Source and Destination days intersect."];
    }
  } else {
    // Clear
    return [initialState.destinationDays, null];
  }
  const [start, end] = action.payload;
  // Copy
  const targetDays = { ...state.destinationDays };
  if (state.destinationDays[start.getTime()] === end.getTime()) {
    // Remove
    delete targetDays[start.getTime()];
  } else if (
    state.maxDestinationDays === -1 ||
    Object.keys(targetDays).length < state.maxDestinationDays
  ) {
    // Add
    targetDays[start.getTime()] = end.getTime();
  }
  return [targetDays, null];
};

const setSelectedDays = (
  state: IRulePageState,
  action: SetSelectedDay
): IRulePageState => {
  if (state.dayTypeBeingSelected === "source") {
    if (theOtherHasIt(action, state.destinationDays)) {
      return {
        ...state,
        dayTypeBeingSelected: "destination",
        destinationDays: setDestinationDays(state, action)[0]
      };
    }
    const sourceDays = setSourceDays(state, action);
    let dayType: IRulePageState["dayTypeBeingSelected"] =
      state.dayTypeBeingSelected;
    if (Object.keys(sourceDays).length === 2) {
      dayType = "destination";
      // Verify position
      if (verifyNoDayIntersection(sourceDays, state.destinationDays)) {
        return {
          ...state,
          error: "Source and Destination days intersect."
        };
      }
    }
    return {
      ...state,
      sourceDays: sourceDays,
      dayTypeBeingSelected: dayType
    };
  } else if (state.dayTypeBeingSelected === "destination") {
    if (theOtherHasIt(action, state.sourceDays)) {
      return {
        ...state,
        dayTypeBeingSelected: "source",
        sourceDays: setSourceDays(state, action)
      };
    }
    const [destinationDays, error] = setDestinationDays(state, action);
    return {
      ...state,
      destinationDays,
      error
    };
  } else {
    return state;
  }
};

function _rulePageReducer(
  state: IRulePageState = initialState,
  action: RulePageActionTypes
): IRulePageState {
  switch (action.type) {
    case CHANGE_OPENED_RULE_ASSIGNMENT:
      return {
        ...state,
        openedRuleAssignment: {
          id:
            action.payload.id === state.openedRuleAssignment.id
              ? null
              : action.payload.id
        },
        collidingRuleAssignments: new Set()
      };
    case CHANGE_OPENED_NEW_RULE_ASSIGNMENT:
      return {
        ...state,
        openedRuleAssignment: {
          id: null,
          new: action.payload
        }
      };
    case SET_QUERY_VARS:
      return {
        ...state,
        queryVariables: {
          ...state.queryVariables,
          ...action.payload
        }
      };
    case SET_COLLIDING_RULE_ASSIGNMENTS:
      return {
        ...state,
        collidingRuleAssignments: !action.payload.collidingRuleAssignments
          ? new Set()
          : new Set(action.payload.collidingRuleAssignments)
      };
    case CHANGE_SIMULATE_RULES_ASSIGNMENTS_OPTIONS:
      return {
        ...state,
        ruleAssignmentSimulation: {
          ...state.ruleAssignmentSimulation,
          ...action.payload
        }
      };
    case SET_VEHICLE_FILTER:
      return {
        ...state,
        selectedVehicleFilter: !!action.payload
          ? {
              ...state.selectedVehicleFilter,
              ...action.payload // Partial
            }
          : null
      };
    case SET_PARKING_RULE:
      return {
        ...state,
        selectedParkingRule: !!action.payload
          ? {
              ...state.selectedParkingRule,
              ...action.payload
            }
          : null
      };
    case SET_SELECTED_DAY:
      return setSelectedDays(state, action);
    case SET_DAY_SELECTOR_MODE:
      if (state.daySelectorMode !== action.payload) {
        return {
          ...state,
          daySelectorMode: action.payload,
          sourceDays: initialState.sourceDays
        };
      } else {
        return state;
      }
    case SET_DAY_TYPE_BEING_SELECTED:
      return {
        ...state,
        dayTypeBeingSelected: action.payload
      };
    case CLEAR_TARGET_DAYS:
      return {
        ...state,
        destinationDays: initialState.destinationDays
      };
    case CLEAR_SELECTED_DAYS:
      return {
        ...state,
        sourceDays: initialState.sourceDays
      };
    case SET_MAX_TARGET_DAYS:
      return {
        ...state,
        maxDestinationDays: Math.max(
          initialState.maxDestinationDays,
          action.payload
        )
      };
    default:
      return state;
  }
}

export function rulePageReducer(
  state: IRulePageState = initialState,
  action: RulePageActionTypes
): IRulePageState {
  if (action.type === SET_ERROR) {
    return {
      ...state,
      error: action.payload
    };
  }
  // Ugly, but it works
  const maskedError = `${state.error} `;
  state.error = maskedError;
  const newState = _rulePageReducer(state, action);
  // Error has not changed
  if (maskedError === newState.error) {
    newState.error = null;
  }
  return newState;
}
