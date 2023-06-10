import gatewaysHandler from "../../pages/api/[...path]";
import testClient from "../helpers/testClient";

const request = testClient(gatewaysHandler);

describe("/user", () => {
  it("should return current user", async () => {
    const res = await request.get("/auction");
    expect(res.status).toBe(200);
  });
});
