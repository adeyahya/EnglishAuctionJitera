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

  afterAll(async () => {
    await resetDb();
  });

  it("Should protected by auth", async () => {
    const res = await request.post("/auction");
    expect(res.status).toBe(401);
  });

  it("Should be able to create an auction", async () => {
    const res = await request
      .post("/auction")
      .send({ title: "Auction test", startingPrice: 100, timeWindow: 2.5 })
      .set("Cookie", cookies);
    expect(res.status).toBe(200);
    const { title, startingPrice, timeWindow, status } = res.body;
    expect({ title, startingPrice, timeWindow, status }).toStrictEqual({
      title: "Auction test",
      startingPrice: 100,
      timeWindow: 2.5,
      status: "DRAFT",
    });
  });

  it("Should check time window is greater or equal than 1 hour", async () => {
    const res = await request
      .post("/auction")
      .send({ title: "Auction test", startingPrice: 100, timeWindow: 0.5 })
      .set("Cookie", cookies);
    expect(res.status).toBe(400);
  });

  it("Should check starting price is greater than 0", async () => {
    const res = await request
      .post("/auction")
      .send({ title: "Auction test", startingPrice: 0.1, timeWindow: 0.5 })
      .set("Cookie", cookies);
    expect(res.status).toBe(400);
  });
});
