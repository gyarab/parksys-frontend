import { IStatsPageState } from "./statsPageModule";

export const CHANGE_SELECTED_TIME = "STATS_PAGE/CHANGE_SELECTED_TIME";
export interface ChangeSelectedTime {
  type: typeof CHANGE_SELECTED_TIME;
  payload: Partial<IStatsPageState["selectedPeriod"]>;
}

export const CHANGE_GRAPH_TIME = "STATS_PAGE/CHANGE_GRAPH_TIME";
export interface ChangeGraphTime {
  type: typeof CHANGE_GRAPH_TIME;
  payload: IStatsPageState["graph"];
}

export type StatsPageActionTypes = ChangeSelectedTime | ChangeGraphTime;
