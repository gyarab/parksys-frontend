import {
  RulePageActionTypes,
  CHANGE_OPENED_RULE_ASSIGNMENT,
  SET_SELECTED_DAY,
  SET_COLLIDING_RULE_ASSIGNMENTS,
  CHANGE_SIMULATE_RULES_ASSIGNMENTS_OPTIONS
} from "./rulePageActionCreators";
import moment = require("moment");

export interface IRulePageState {
  selectedDay: string;
  openedRuleAssignmentId?: string | null;
  collidingRuleAssignments: Set<string>;
  ruleAssignmentSimulation: {
    on: boolean;
    start: Date;
    end: Date;
    vehicle: string; // id
  };
}

const defaultSelectedDay = () => new Date().toISOString().slice(0, 10);
export const initialState: IRulePageState = {
  selectedDay: defaultSelectedDay(),
  openedRuleAssignmentId: null,
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
  }
};

export function rulePageReducer(
  state: IRulePageState = initialState,
  action: RulePageActionTypes
): IRulePageState {
  switch (action.type) {
    case CHANGE_OPENED_RULE_ASSIGNMENT:
      return {
        ...state,
        openedRuleAssignmentId:
          action.payload.id === state.openedRuleAssignmentId
            ? null
            : action.payload.id,
        collidingRuleAssignments: new Set()
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
    default:
      return state;
  }
}
