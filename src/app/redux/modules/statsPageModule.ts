import {
  StatsPageActionTypes,
  CHANGE_SELECTED_TIME
} from "./statsPageActionCreators";

export interface IStatsPageState {
  selectedPeriod: {
    year: number;
    month?: number;
    date?: number;
  };
}

export const initialState: IStatsPageState = {
  selectedPeriod: {
    year: new Date().getFullYear()
  }
};

export const statsPageReducer = (
  state: IStatsPageState = initialState,
  action: StatsPageActionTypes
): IStatsPageState => {
  switch (action.type) {
    case CHANGE_SELECTED_TIME:
      return {
        ...state,
        selectedPeriod:
          action.payload.action === "merge"
            ? {
                ...state.selectedPeriod,
                ...action.payload.time
              }
            : {
                year: initialState.selectedPeriod.year,
                ...action.payload.time
              }
      };
    default:
      return state;
  }
};
