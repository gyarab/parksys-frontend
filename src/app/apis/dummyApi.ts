import { ITranslations } from "../redux/modules/settingsModule";
import { config } from "../../../config";

// Don't forget to enable this in production!
// tslint:disable:no-http-string

export const dummyApi = {
  getStarsCount: (): Promise<number> => {
    return fetch(
      "https://api.github.com/repos/crazyfactory/ts-react-boilerplate"
    )
      .then(res => res.json())
      .then(json => json.stargazers_count);
  },
  getTranslations: (payload: string): Promise<ITranslations> => {
    return fetch(`${config.url}/translations/${payload}`).then(res =>
      res.json()
    );
  }
};
