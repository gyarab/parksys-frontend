export const SEND_MESSAGE = "SEND_MESSAGE";
export const DELETE_MESSAGE = "DELETE_MESSAGE";

export const CHANGE_OPENED_RULE_ASSIGNMENT =
  "RULE_PAGE/CHANGE_OPENED_RULE_ASSIGNMENT";
interface ChangeOpenedRuleAssignment {
  type: typeof CHANGE_OPENED_RULE_ASSIGNMENT;
  payload: {
    id: string | null;
  };
}

export const SET_SELECTED_DAY = "RULE_PAGE/SET_SELECTED_DAY";
interface SetSelectedDay {
  type: typeof SET_SELECTED_DAY;
  payload: {
    // If null, today is set
    day: string | null;
  };
}

export type RulePageActionTypes = ChangeOpenedRuleAssignment | SetSelectedDay;
