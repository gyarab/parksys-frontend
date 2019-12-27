import {
  RulePageActionTypes,
  CHANGE_OPENED_RULE_ASSIGNMENT,
  SET_SELECTED_DAY,
  SET_COLLIDING_RULE_ASSIGNMENTS
} from "./rulePageActionCreators";

export interface IRulePageState {
  selectedDay: string;
  openedRuleAssignmentId?: string | null;
  collidingRuleAssignments: Set<string>;
}

const defaultSelectedDay = () => new Date().toISOString().slice(0, 10);
export const initialState: IRulePageState = {
  selectedDay: defaultSelectedDay(),
  openedRuleAssignmentId: null,
  collidingRuleAssignments: new Set()
};

export function rulePageReducer(
  state: IRulePageState = initialState,
  action: RulePageActionTypes
): IRulePageState {
  switch (action.type) {
    case CHANGE_OPENED_RULE_ASSIGNMENT:
      const same = action.payload.id === state.openedRuleAssignmentId;
      return {
        ...state,
        openedRuleAssignmentId: same ? null : action.payload.id,
        // Reset collidingRuleAssignments when details are closed
        collidingRuleAssignments: same
          ? new Set()
          : state.collidingRuleAssignments
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
    default:
      return state;
  }
}
