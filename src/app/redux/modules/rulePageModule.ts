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
  SET_DAY_SELECTOR_MODE
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
  daySelectorMode: "continuous" | "separate";
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
  daySelectorMode: "continuous"
};

const setSelectedDays = (
  state: IRulePageState,
  action: SetSelectedDay
): IRulePageState["selectedDays"] => {
  if (action.payload === null) {
    // Clear
    return {};
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
      return {
        ...state,
        selectedDays: setSelectedDays(state, action)
      };
    case SET_DAY_SELECTOR_MODE:
      return {
        ...state,
        daySelectorMode: action.payload
      };
    default:
      return state;
  }
}
