import {
  StatsPageActionTypes,
  CHANGE_SELECTED_TIME,
  CHANGE_GRAPH_TIME
} from "./statsPageActionCreators";

export interface IStatsPageState {
  selectedPeriod: {
    year: number;
    month?: number | null;
    date?: number | null;
  };
  graph: "months" | "days" | "hours" | "yearDays";
}

export const initialState: IStatsPageState = {
  selectedPeriod: {
    year: new Date().getFullYear()
  },
  graph: "months"
};

export const statsPageReducer = (
  state: IStatsPageState = initialState,
  action: StatsPageActionTypes
): IStatsPageState => {
  switch (action.type) {
    case CHANGE_SELECTED_TIME:
      return {
        ...state,
        selectedPeriod: {
          ...state.selectedPeriod,
          ...action.payload
        }
      };
    case CHANGE_GRAPH_TIME:
      return {
        ...state,
        graph: action.payload
      };
    default:
      return state;
  }
};
