import { RouterState } from "redux-router5";
import { ICounterState } from "./modules/counterModule";
import { ISettingsState } from "./modules/settingsModule";
import { IStarsState } from "./modules/starsModule";
import { IUserState } from "./modules/userModule";
import { IDevicesState } from "./modules/devicesModule";

export interface IStore {
  counter: ICounterState;
  router: RouterState;
  settings: ISettingsState;
  stars: IStarsState;
  user: IUserState;
  devices: IDevicesState;
}
