import {
  CHANGE_OPENED_RULE_ASSIGNMENT,
  RulePageActionTypes
} from "./rulePageActionCreators";

export interface IRulePageState {
  openedRuleAssignmentId?: string | null;
}

export const initialState: IRulePageState = {
  openedRuleAssignmentId: null
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
        openedRuleAssignmentId: same ? null : action.payload.id
      };
    default:
      return state;
  }
}
