function fillArray<T>(n: number, value: T): T[] {
  const array: Array<T> = new Array(n);
  array.fill(value, 0, n);
  return array;
}

export const loginApi = {
  loginUser: (user: string, password: string) => (): Promise<{
    token: string;
  }> => {
    return new Promise(resolve => {
      setTimeout(() => {
        console.log(
          `LOGGED IN ${user} with password ${fillArray(
            password.length,
            "*"
          ).join("")}`
        );
        resolve({ token: "header.payload.signature" });
      }, 200);
    });
  }
};
