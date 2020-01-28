import {
  RulePageActionTypes,
  CHANGE_OPENED_RULE_ASSIGNMENT,
  SET_SELECTED_DAY,
  SET_COLLIDING_RULE_ASSIGNMENTS,
  CHANGE_SIMULATE_RULES_ASSIGNMENTS_OPTIONS,
  CHANGE_OPENED_NEW_RULE_ASSIGNMENT,
  SET_VEHICLE_FILTER,
  SET_PARKING_RULE
} from "./rulePageActionCreators";
import moment = require("moment");

export interface IRulePageStateSimulation {
  on: boolean;
  start: Date;
  end: Date;
  vehicle: {
    id: string;
    licensePlate?: string;
  };
}

export interface IRulePageState {
  selectedDay: string;
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
}

const defaultSelectedDay = () => new Date().toISOString().slice(0, 10);
export const initialState: IRulePageState = {
  selectedDay: defaultSelectedDay(),
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
  selectedParkingRule: null
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
    case SET_SELECTED_DAY:
      return {
        ...state,
        selectedDay: !action.payload.day
          ? defaultSelectedDay()
          : action.payload.day
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
    default:
      return state;
  }
}
