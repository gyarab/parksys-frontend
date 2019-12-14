import { config } from "../../../config";

// TODO: Get hostname from config
export default async (path: string) => {
  const url = `${config.backendApi.root}${path}`;
  console.log(url);
  return fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`
    }
  });
};
