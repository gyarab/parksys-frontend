import { IRulePageStateSimulation, IRulePageState } from "./rulePageModule";

export const SEND_MESSAGE = "SEND_MESSAGE";
export const DELETE_MESSAGE = "DELETE_MESSAGE";

export const CHANGE_OPENED_RULE_ASSIGNMENT =
  "RULE_PAGE/CHANGE_OPENED_RULE_ASSIGNMENT";
export interface ChangeOpenedRuleAssignment {
  type: typeof CHANGE_OPENED_RULE_ASSIGNMENT;
  payload: {
    id: string | null;
  };
}

export const SET_QUERY_VARS = "RULE_PAGE/SET_QUERY_VARS";
export interface SetQueryVars {
  type: typeof SET_QUERY_VARS;
  payload: Partial<IRulePageState["queryVariables"]>;
}

export const SET_COLLIDING_RULE_ASSIGNMENTS =
  "RULE_PAGE/SET_COLLIDING_RULE_ASSIGNMENTS";
export interface SetCollidingRuleAssignments {
  type: typeof SET_COLLIDING_RULE_ASSIGNMENTS;
  payload: {
    collidingRuleAssignments: Array<string>;
  };
}

export const CHANGE_SIMULATE_RULES_ASSIGNMENTS_OPTIONS =
  "RULE_PAGE/CHANGE_SIMULATE_RULES_ASSIGNMENTS_OPTIONS";
export interface ChangeSimulateRuleAssignmentsOptions {
  type: typeof CHANGE_SIMULATE_RULES_ASSIGNMENTS_OPTIONS;
  payload: IRulePageStateSimulation;
}

export const CHANGE_OPENED_NEW_RULE_ASSIGNMENT =
  "RULE_PAGE/CHANGE_OPENED_NEW_RULE_ASSIGNMENT";
export interface ChangeOpenedNewRuleAssignment {
  type: typeof CHANGE_OPENED_NEW_RULE_ASSIGNMENT;
  payload: IRulePageState["openedRuleAssignment"]["new"];
}

export const SET_VEHICLE_FILTER = "RULE_PAGE/SET_VEHICLE_FILTER";
export interface SetVehicleFilter {
  type: typeof SET_VEHICLE_FILTER;
  payload: Partial<IRulePageState["selectedVehicleFilter"]> | null;
}

export const SET_PARKING_RULE = "RULE_PAGE/SET_PARKING_RULE";
export interface SetParkingRule {
  type: typeof SET_PARKING_RULE;
  payload: Partial<IRulePageState["selectedParkingRule"]>;
}

export type RulePageActionTypes =
  | ChangeOpenedRuleAssignment
  | SetQueryVars
  | SetCollidingRuleAssignments
  | ChangeSimulateRuleAssignmentsOptions
  | ChangeOpenedNewRuleAssignment
  | SetVehicleFilter
  | SetParkingRule;
