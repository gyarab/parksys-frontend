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

export const SET_SELECTED_DAY = "RULE_PAGE/SET_SELECTED_DAYS";
export interface SetSelectedDay {
  type: typeof SET_SELECTED_DAY;
  payload: [Date, Date] | null;
}

export const SET_DAY_SELECTOR_MODE = "RULE_PAGE/SET_DAY_SELECTOR_MODE";
export interface SetDaySelectorMode {
  type: typeof SET_DAY_SELECTOR_MODE;
  payload: IRulePageState["daySelectorMode"];
}

export const SET_DAY_TYPE_BEING_SELECTED =
  "RULE_PAGE/SET_DAY_TYPE_BEING_SELECTED";
export interface SetDayTypeBeingSelected {
  type: typeof SET_DAY_TYPE_BEING_SELECTED;
  payload: IRulePageState["dayTypeBeingSelected"];
}

export const CLEAR_TARGET_DAYS = "RULE_PAGE/CLEAR_TARGET_DAYS";
export interface ClearTargetDays {
  type: typeof CLEAR_TARGET_DAYS;
  payload: null;
}

export const CLEAR_SELECTED_DAYS = "RULE_PAGE/CLEAR_SELECTED_DAYS";
export interface ClearSelectedDays {
  type: typeof CLEAR_SELECTED_DAYS;
  payload: null;
}

export const SET_MAX_TARGET_DAYS = "RULE_PAGE/SET_MAX_TARGET_DAYS";
export interface SetMaxTargetDays {
  type: typeof SET_MAX_TARGET_DAYS;
  payload: number;
}

export const SET_ERROR = "RULE_PAGE/SET_ERROR";
export interface SetError {
  type: typeof SET_ERROR;
  payload: string | null;
}

export type RulePageActionTypes =
  | ChangeOpenedRuleAssignment
  | SetQueryVars
  | SetCollidingRuleAssignments
  | ChangeSimulateRuleAssignmentsOptions
  | ChangeOpenedNewRuleAssignment
  | SetVehicleFilter
  | SetParkingRule
  | SetSelectedDay
  | SetDaySelectorMode
  | SetDayTypeBeingSelected
  | ClearTargetDays
  | ClearSelectedDays
  | SetMaxTargetDays
  | SetError;
