import { config } from "../../../config";

export default async (path: string) => {
  const url = `${config.backendApi.root}${path}`;
  return fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`
    }
  });
};
