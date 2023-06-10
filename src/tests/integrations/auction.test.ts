import generateUser from "@/tests/helpers/generateUser";
import resetDb from "@/tests/helpers/resetDb";
import testClient from "@/tests/helpers/testClient";
import addHours from "date-fns/addHours";

const request = testClient();

const usertest = {
  name: "Testing",
  email: "testing@test.com",
  password: "secretpassword",
};

const auctionData = {
  title: "Auction test",
  startingPrice: 100,
  timeWindow: 2.5,
};

let cookies: string[] = [];
let auctionId = "";

describe("Account Test", () => {
  beforeAll(async () => {
    await resetDb();
    cookies = await generateUser(usertest);
  });

  it("Should protected by auth", async () => {
    const res = await request.post("/auction");
    expect(res.status).toBe(401);
  });

  it("Should be able to create an auction", async () => {
    const res = await request
      .post("/auction")
      .send(auctionData)
      .set("Cookie", cookies);
    expect(res.status).toBe(200);
    const { title, startingPrice, timeWindow, status } = res.body;
    expect({ title, startingPrice, timeWindow, status }).toStrictEqual({
      ...auctionData,
      status: "DRAFT",
    });
    auctionId = res.body.id;
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

  it("Should be able to publish auction", async () => {
    const res = await request
      .post(`/auction/${auctionId}/publish`)
      .set("Cookie", cookies);
    expect(res.status).toBe(200);
  });

  it("Should make sure published auction has status OPEN", async () => {
    const res = await request.get(`/auction/${auctionId}`);
    expect(res.status).toBe(200);
    expect(res.body.status).toEqual("OPEN");
  });

  it("Should make sure it has endedAt = publishedAt + timewindow", async () => {
    const res = await request.get(`/auction/${auctionId}`);
    expect(res.status).toBe(200);
    const expectedEndedAt = addHours(
      new Date(res.body.publishedAt),
      res.body.timeWindow
    );
    expect(new Date(res.body.endedAt).getTime()).toStrictEqual(
      expectedEndedAt.getTime()
    );
  });
});
