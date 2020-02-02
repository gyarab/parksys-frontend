import {
  StatsPageActionTypes,
  CHANGE_SELECTED_DAY
} from "./statsPageActionCreators";

export interface IStatsPageState {
  selectedDay: string;
}

export const initialState: IStatsPageState = {
  selectedDay: new Date().toISOString().slice(0, 10)
};

export const statsPageReducer = (
  state: IStatsPageState = initialState,
  action: StatsPageActionTypes
): IStatsPageState => {
  switch (action.type) {
    case CHANGE_SELECTED_DAY:
      return {
        ...state,
        selectedDay: action.payload
      };
    default:
      return state;
  }
};
