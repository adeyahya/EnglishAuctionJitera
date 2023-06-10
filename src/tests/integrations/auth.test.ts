import { PrismaClient } from "@prisma/client";
import resetDb from "@/tests/helpers/resetDb";
import testClient from "@/tests/helpers/testClient";

const prisma = new PrismaClient();
const request = testClient();

const usertest = {
  name: "Testing",
  email: "testing@test.com",
  password: "secretpassword",
};

let cookies: string[] = [];

describe("Auth Integration", () => {
  beforeAll(async () => {
    await resetDb();
  });

  afterAll(async () => {
    await resetDb();
  });

  it("Should sucessfully register new user", async () => {
    const res = await request.post("/auth/register").send(usertest);
    expect(res.status).toBe(200);
  });

  it("Should store hashed password", async () => {
    const user = await prisma.user.findUnique({
      where: { email: usertest.email },
    });
    expect(user?.password === usertest.password).toBeFalsy();
  });

  it("Should be able login using registered user", async () => {
    const res = await request.post("/auth/login").send(usertest);
    expect(res.status).toBe(200);
    expect(res.headers["set-cookie"]).toBeTruthy();
    cookies = res.headers["set-cookie"];
  });

  it("Should be able request auth user information", async () => {
    const res = await request.get("/auth").set("Cookie", cookies);
    expect(res.status).toBe(200);
    expect(res.body.email).toEqual(usertest.email);
  });

  it("Should be protect unauthenticated request", async () => {
    const res = await request.get("/auth");
    expect(res.status).toBe(401);
  });
});
