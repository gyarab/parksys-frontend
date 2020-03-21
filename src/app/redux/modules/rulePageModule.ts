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
  SET_MAX_TARGET_DAYS
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
  selectedDays: { [startTimestamp: number]: number };
  daySelectorMode: "continuous" | "separate" | "none";
  dayTypeBeingSelected: "target" | "source";
  targetDays: { [startTimestamp: number]: number };
  maxTargetDays: number;
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
  selectedDays: {},
  daySelectorMode: "continuous",
  targetDays: {},
  maxTargetDays: -1,
  dayTypeBeingSelected: "source"
};

const setSelectedDays = (
  state: IRulePageState,
  action: SetSelectedDay
): IRulePageState["selectedDays"] => {
  if (action.payload === null) {
    // Clear
    return initialState.selectedDays;
  }
  const [start, end] = action.payload;
  // Copy
  const selectedDays = { ...state.selectedDays };
  if (state.selectedDays[start.getTime()] === end.getTime()) {
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

const setTargetDays = (
  state: IRulePageState,
  action: SetSelectedDay
): IRulePageState["targetDays"] => {
  if (action.payload === null) {
    // Clear
    return initialState.targetDays;
  }
  const [start, end] = action.payload;
  // Copy
  const targetDays = { ...state.targetDays };
  if (state.targetDays[start.getTime()] === end.getTime()) {
    // Remove
    delete targetDays[start.getTime()];
  } else if (
    state.maxTargetDays === -1 ||
    Object.keys(targetDays).length < state.maxTargetDays
  ) {
    // Add
    console.log("ADD", Object.keys(targetDays).length, state.maxTargetDays);
    targetDays[start.getTime()] = end.getTime();
  }
  return targetDays;
};

export function rulePageReducer(
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
      if (state.dayTypeBeingSelected === "source") {
        console.log("srcsrc");
        return {
          ...state,
          selectedDays: setSelectedDays(state, action)
        };
      } else if (state.dayTypeBeingSelected === "target") {
        console.log("trgtrg");
        return {
          ...state,
          targetDays: setTargetDays(state, action)
        };
      } else {
        return state;
      }
    case SET_DAY_SELECTOR_MODE:
      // Clear selectedDays when mode changes
      if (state.daySelectorMode !== action.payload) {
        return {
          ...state,
          daySelectorMode: action.payload,
          selectedDays: initialState.selectedDays
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
        targetDays: initialState.targetDays
      };
    case CLEAR_SELECTED_DAYS:
      return {
        ...state,
        selectedDays: initialState.selectedDays
      };
    case SET_MAX_TARGET_DAYS:
      return {
        ...state,
        maxTargetDays: Math.max(initialState.maxTargetDays, action.payload)
      };
    default:
      return state;
  }
}
