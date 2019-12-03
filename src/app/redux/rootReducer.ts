import { combineReducers, Reducer } from "redux";
import { router5Reducer } from "redux-router5";
import { IStore } from "./IStore";
import { counterReducer } from "./modules/counterModule";
import { settingsReducer } from "./modules/settingsModule";
import { starsReducer } from "./modules/starsModule";
import { userReducer } from "./modules/userModule";
import { deviceReducer } from "./modules/devicesModule";

const rootReducer: Reducer<IStore> = combineReducers<IStore>({
  counter: counterReducer,
  router: router5Reducer,
  settings: settingsReducer,
  stars: starsReducer,
  user: userReducer,
  devices: deviceReducer
});

export default rootReducer;
