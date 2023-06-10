import generateUser from "@/tests/helpers/generateUser";
import resetDb from "@/tests/helpers/resetDb";
import testClient from "@/tests/helpers/testClient";

const request = testClient();

const usertest = {
  name: "Testing",
  email: "testing@test.com",
  password: "secretpassword",
};

let cookies: string[] = [];

describe("Account Test", () => {
  beforeAll(async () => {
    await resetDb();
    cookies = await generateUser(usertest);
  });

  it("Should protected by auth", async () => {
    const res = await request.post("/account/deposit").send({ amount: 100 });
    expect(res.status).toBe(401);
  });

  it("Should be able to deposit money", async () => {
    const res = await request
      .post("/account/deposit")
      .send({ amount: 100 })
      .set("Cookie", cookies);
    expect(res.status).toBe(200);
    expect(res.body.balance).toBe(100);
    expect(res.body.reserved).toBe(0);
  });

  it("Shouldn't be able to deposit negative money", async () => {
    const res = await request
      .post("/account/deposit")
      .send({ amount: -100 })
      .set("Cookie", cookies);
    expect(res.status).toBe(400);
  });

  it("Should be able to add more deposit", async () => {
    const res = await request
      .post("/account/deposit")
      .send({ amount: 100 })
      .set("Cookie", cookies);
    expect(res.status).toBe(200);
    expect(res.body.balance).toBe(200);
    expect(res.body.reserved).toBe(0);
  });
});
