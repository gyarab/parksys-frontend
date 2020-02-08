import { RouterState } from "redux-router5";
import { ISettingsState } from "./modules/settingsModule";
import { IUserState } from "./modules/userModule";
import { IDevicesState } from "./modules/devicesModule";
import { IRulePageState } from "./modules/rulePageModule";
import { IStatsPageState } from "./modules/statsPageModule";
import { IUserMngmtPageState } from "./modules/userMngmtPageModule";

export interface IStore {
  router: RouterState;
  settings: ISettingsState;
  user: IUserState;
  devices: IDevicesState;
  rulePage: IRulePageState;
  statsPage: IStatsPageState;
  userMngmtPage: IUserMngmtPageState;
}
