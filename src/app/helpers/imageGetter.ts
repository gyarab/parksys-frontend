import { config } from "../../../config";

export default (path: string): Promise<Response> => {
  const url = `${config.backendApi.root}${path}`;
  return fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`
    }
  });
};
