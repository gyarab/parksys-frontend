import {
  CHANGE_OPENED_RULE_ASSIGNMENT,
  RulePageActionTypes,
  SET_SELECTED_DAY
} from "./rulePageActionCreators";

export interface IRulePageState {
  selectedDay: string;
  openedRuleAssignmentId?: string | null;
}

const defaultSelectedDay = () => new Date().toISOString().slice(0, 10);
export const initialState: IRulePageState = {
  selectedDay: defaultSelectedDay(),
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
    case SET_SELECTED_DAY:
      const empty = action.payload.day === null;
      return {
        ...state,
        selectedDay: empty ? defaultSelectedDay() : action.payload.day
      };
    default:
      return state;
  }
}
