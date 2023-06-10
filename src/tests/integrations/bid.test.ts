import generateUser from "@/tests/helpers/generateUser";
import resetDb from "@/tests/helpers/resetDb";
import testClient from "@/tests/helpers/testClient";

const request = testClient();

const users = [
  { name: "User 1", email: "user1@test.com", password: "testpassword" },
  { name: "User 2", email: "user2@test.com", password: "testpassword" },
  { name: "User 3", email: "user3@test.com", password: "testpassword" },
  { name: "User 4", email: "user4@test.com", password: "testpassword" },
];

const auctionData = {
  title: "Auction test",
  startingPrice: 10,
  timeWindow: 2,
};

let auctionId = "";
let cookies: string[][] = [];

describe("Account Integration", () => {
  beforeAll(async () => {
    await resetDb();
    const promises = users.map(async (user) => {
      const cookie = await generateUser(user);
      await request
        .post("/account/deposit")
        .send({ amount: 100 })
        .set("Cookie", cookie);
      cookies.push(cookie);
    });
    await Promise.all(promises);
    const cookie = cookies[0];
    // the first user create an auction
    const auction = await request
      .post("/auction")
      .send(auctionData)
      .set("Cookie", cookie);
    auctionId = auction.body.id;
    // publish the auction
    await request.post(`/auction/${auctionId}/publish`).set("Cookie", cookie);
  });

  it("Should reject bid on lower than starting price", async () => {
    const cookie = cookies[1];
    const res = await request
      .post(`/auction/${auctionId}`)
      .send({ offer: 9.9 })
      .set("Cookie", cookie);
    expect(res.status).toBe(400);
  });

  it("Should be able to bid on starting price", async () => {
    const cookie = cookies[1];
    const res = await request
      .post(`/auction/${auctionId}`)
      .send({ offer: 10 })
      .set("Cookie", cookie);
    expect(res.status).toBe(200);
  });

  it("Should make sure reserved balance increased", async () => {
    const cookie = cookies[1];
    const res = await request.get("/account/balance").set("Cookie", cookie);
    expect(res.status).toBe(200);
    expect(res.body.reserved).toEqual(10);
  });

  it("Should reject bid lower than previous bid on user 2", async () => {
    const cookie = cookies[2];
    const res = await request
      .post(`/auction/${auctionId}`)
      .send({ offer: 10 })
      .set("Cookie", cookie);
    expect(res.status).toBe(400);
  });

  it("Should accept higher bid from user 2", async () => {
    const cookie = cookies[2];
    const res = await request
      .post(`/auction/${auctionId}`)
      .send({ offer: 11 })
      .set("Cookie", cookie);
    expect(res.status).toBe(200);
  });

  it("Should make sure reserved balance on user 2 increased", async () => {
    const cookie = cookies[2];
    const res = await request.get("/account/balance").set("Cookie", cookie);
    expect(res.status).toBe(200);
    expect(res.body.reserved).toEqual(11);
  });

  it("Should decrease reserved balance on user 1", async () => {
    const cookie = cookies[1];
    const res = await request.get("/account/balance").set("Cookie", cookie);
    expect(res.status).toBe(200);
    expect(res.body.reserved).toEqual(0);
  });
});
