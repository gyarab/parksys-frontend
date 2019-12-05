// TODO: Get hostname from config
export default async (path: string) => {
  const url = "http://localhost:8080" + path;
  return fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`
    }
  });
};
