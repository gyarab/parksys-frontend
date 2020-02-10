import { IStatsPageState } from "./statsPageModule";

export const CHANGE_SELECTED_TIME = "STATS_PAGE/CHANGE_SELECTED_TIME";
export interface ChangeSelectedTime {
  type: typeof CHANGE_SELECTED_TIME;
  payload: IStatsPageState["selectedPeriod"];
}

export type StatsPageActionTypes = ChangeSelectedTime;
