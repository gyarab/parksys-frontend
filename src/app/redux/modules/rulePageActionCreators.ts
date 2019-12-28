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

export const SET_COLLIDING_RULE_ASSIGNMENTS =
  "RULE_PAGE/SET_COLLIDING_RULE_ASSIGNMENTS";
interface SetCollidingRuleAssignments {
  type: typeof SET_COLLIDING_RULE_ASSIGNMENTS;
  payload: {
    collidingRuleAssignments: Array<string>;
  };
}

export const CHANGE_SIMULATE_RULES_ASSIGNMENTS_OPTIONS =
  "RULE_PAGE/CHANGE_SIMULATE_RULES_ASSIGNMENTS_OPTIONS";
interface ChangeSimulateRuleAssignmentsOptions {
  type: typeof CHANGE_SIMULATE_RULES_ASSIGNMENTS_OPTIONS;
  payload: {
    on: boolean;
    start: Date;
    end: Date;
    vehicle: string; // id
  };
}

export type RulePageActionTypes =
  | ChangeOpenedRuleAssignment
  | SetSelectedDay
  | SetCollidingRuleAssignments
  | ChangeSimulateRuleAssignmentsOptions;
