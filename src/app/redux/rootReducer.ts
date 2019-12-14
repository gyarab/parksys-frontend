import { combineReducers, Reducer } from "redux";
import { router5Reducer } from "redux-router5";
import { IStore } from "./IStore";
import { settingsReducer } from "./modules/settingsModule";
import { userReducer } from "./modules/userModule";
import { deviceReducer } from "./modules/devicesModule";

const rootReducer: Reducer<IStore> = combineReducers<IStore>({
  router: router5Reducer,
  settings: settingsReducer,
  user: userReducer,
  devices: deviceReducer
});

export default rootReducer;
