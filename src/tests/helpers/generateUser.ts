import testClient from "./testClient";

const request = testClient();

const generateUser = async (user: {
  name: string;
  email: string;
  password: string;
}): Promise<string[]> => {
  await request.post("/auth/register").send(user);
  const res = await request.post("/auth/login").send(user);
  return res.headers["set-cookie"] as string[];
};

export default generateUser;
