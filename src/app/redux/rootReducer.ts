import { combineReducers, Reducer } from "redux";
import { router5Reducer } from "redux-router5";
import { persistReducer } from "redux-persist";
import { config as appConfig } from "../../../config";
import storage from "redux-persist/lib/storage";
import { IStore } from "./IStore";
import { settingsReducer } from "./modules/settingsModule";
import { userReducer } from "./modules/userModule";
import { deviceReducer } from "./modules/devicesModule";
import { rulePageReducer } from "./modules/rulePageModule";
import { statsPageReducer } from "./modules/statsPageModule";

const commonPersistenceOptions = {
  debug: appConfig.env !== "production" && !!process.env.BROWSER,
  storage
};

const persistedUserReducer = persistReducer(
  {
    ...commonPersistenceOptions,
    key: "user"
  },
  userReducer
);

const persistedSettingsReducer = persistReducer(
  {
    ...commonPersistenceOptions,
    key: "settings"
  },
  settingsReducer
);

const rootReducer: Reducer<IStore> = combineReducers<IStore>({
  router: router5Reducer,
  devices: deviceReducer,
  rulePage: rulePageReducer,
  // Persisted reducers
  settings: persistedSettingsReducer,
  user: persistedUserReducer,
  statsPage: statsPageReducer
});

export default rootReducer;
