import { config } from "../../../config";

export const loginApi = {
  loginUser: (user: string, password: string) => (): Promise<{
    accessToken: string;
    refreshToken: string;
  }> => {
    return fetch(config.backendApi.root + "/login/password", {
      method: "POST",
      body: JSON.stringify({
        user,
        password
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(json => {
        return {
          accessToken: json.data.accessToken,
          refreshToken: json.data.refreshToken
        };
      });
  }
};
