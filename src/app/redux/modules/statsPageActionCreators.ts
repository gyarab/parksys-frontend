import { IStatsPageState } from "./statsPageModule";

export const CHANGE_SELECTED_DAY = "RULE_PAGE/CHANGE_OPENED_RULE_ASSIGNMENT";
export interface ChangeSelectedDay {
  type: typeof CHANGE_SELECTED_DAY;
  payload: IStatsPageState["selectedDay"];
}

export type StatsPageActionTypes = ChangeSelectedDay;
